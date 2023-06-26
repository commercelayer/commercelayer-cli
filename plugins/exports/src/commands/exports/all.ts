import ExportsCreate from './create'
import { ExportCommand, cliux, notify, Flags, encoding } from '../../base'
import { clApi, clColor, clConfig, clUtil } from '@commercelayer/cli-core'
import type { Export, ExportCreate, Sku } from '@commercelayer/sdk'
import type { ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import Spinnies from 'spinnies'
import open from 'open'
import { readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'


const ALLOW_OVERQUEUING = false // Allow to bypass the limit of concurrent exports
const MAX_QUEUE_LENGTH = clConfig.exports.max_queue_length
const MAX_EXPORT_SIZE = clConfig.exports.max_size


const exportCompleted = (exports: Export[]): boolean => {
  return !exports.some(exp => exp.status !== 'completed')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const countCompleted = (exports: Export[]): number => {
  let completed = 0
  for (const e of exports) if (e.status === 'completed') completed++
  return completed
}


const generateGroupUID = (): string => {

  const firstPart = Math.trunc(Math.random() * 46_656)
  const secondPart = Math.trunc(Math.random() * 46_656)
  const firstPartStr = ('000' + firstPart.toString(36)).slice(-3)
  const secondPartStr = ('000' + secondPart.toString(36)).slice(-3)

  return firstPartStr + secondPartStr

}


export default class ExportsAll extends ExportCommand {

  static hidden = true

  static description = 'export all the records'

  static aliases = ['exp:all', 'export']

  static examples = [
    '$ commercelayer exports:all -t cusorderstomers -X <output-file-path>',
    '$ cl exp:all -t customers -i customer_subscriptions -w email_end=@test.org',
  ]

  static flags = {
    // ...(clCommand.commandFlags<typeof ExportsCreate.flags>(ExportsCreate.flags, ['save-params', 'load-params'])),
    ...ExportsCreate.flags,
    quiet: Flags.boolean({
      char: 'q',
      description: 'execute command without showing warning messages'
    }),
    keep: Flags.boolean({
      char: 'k',
      description: 'keep original export files in temp dir'
    })
  }


  public async run(): Promise<void> {

    const { flags } = await this.parse(ExportsAll)

    const accessToken = flags.accessToken
    this.checkApplication(accessToken, ['integration', 'cli'])

    const outputPath = flags.save || flags['save-path']
    if (!outputPath) this.error('Undefined output file path')

    if (flags.prettify && ((flags.format === 'csv') || flags.csv)) this.error(`Flag ${clColor.cli.flag('Prettify')} can only be used with ${clColor.cli.value('JSON')} format`)

    const resType = flags.type
    if (!clConfig.exports.types.includes(resType)) this.error(`Unsupported resource type: ${clColor.style.error(resType)}`)
    const resDesc = resType.replace(/_/g, ' ')

    const notification = flags.notify || false
    const blindMode = flags.blind || false
    const format = this.getFileFormat(flags)

    // Include flags
    const include: string[] = this.includeFlag(flags.include)
    // Where flags
    const wheres = this.whereFlag(flags.where)


    const cl = this.commercelayerInit(flags)

    const expCreate: ExportCreate = {
      resource_type: resType,
      format,
      dry_data: flags['dry-data']
    }

    if (include && (include.length > 0)) expCreate.includes = include
    if (wheres && (Object.keys(wheres).length > 0)) expCreate.filters = wheres
    else expCreate.filters = {}


    const resSdk = cl[resType as ListableResourceType]

    try {

      const totRecords = await resSdk.count({ filters: wheres, pageSize: 1, pageNumber: 1 })
      const totExports = Math.ceil(totRecords / MAX_EXPORT_SIZE)

      if ((totExports > MAX_QUEUE_LENGTH) && !ALLOW_OVERQUEUING)
        this.error(`The number of exports (${clColor.msg.error(totExports)}) exceeds the maximum allowed (${clColor.yellowBright(MAX_QUEUE_LENGTH)})`, {
          suggestions: ['Add more filters to reduce the number of export that will be created']
        })


      if (totExports > 1) {

        const groupId = generateGroupUID()
        expCreate.reference = groupId
        expCreate.reference_origin = 'cli-plugin-exports'

        if (!flags.quiet) {
          const msg1 = `You have requested to export ${clColor.yellowBright(totRecords)} ${resDesc}, more than the maximun ${MAX_EXPORT_SIZE} elements allowed for each single export.`
          const msg2 = `The export will be split into a set of ${clColor.yellowBright(totExports)} distinct exports with the same unique group ID ${clColor.underline.yellowBright(groupId)}.`
          const msg3 = `Execute the command ${clColor.cli.command(`exports:group ${groupId}`)} to retrieve all the related exports`
          this.log(`\n${msg1} ${msg2} ${msg3}`)
          this.log()
          await cliux.anykey()
        }

      }

      this.log(`\nExporting ${clColor.yellowBright(totRecords)} ${resDesc} ...`)

      const exports: Export[] = []
      let startId = null
      let stopId = null
      let expPage = 0

      // Export split simulation ...
      // 1500  --> 1: 1500,  2: x
      // 10000 --> 1: 10000, 2: x
      // 15000 --> 1: 10000, 2: 5000,  3: x
      // 20000 --> 1: 10000, 2: 10000, 3: x
      // 25000 --> 1: 10000, 2: 10000, 3: 5000, 4: x

      let spinners: typeof Spinnies
      if (!blindMode) spinners = new Spinnies()

      for (let curExp = 0; curExp < totExports; curExp++) {

        const curIdx = curExp + 1
        const exportName = `Export_${curIdx}`
        if (totExports > 1) expCreate.reference = `${expCreate.reference}-${curIdx}`

        if (!blindMode) spinners.add(exportName)

        const curExpRecords = Math.min(MAX_EXPORT_SIZE, totRecords - (MAX_EXPORT_SIZE * curExp))
        const curExpPages = Math.ceil(curExpRecords / clConfig.api.page_max_size)
        expPage += curExpPages

        const curExpLastPage = await resSdk.list({ filters: wheres, pageSize: clConfig.api.page_max_size, pageNumber: expPage, sort: { code: 'asc' } })

        stopId = (curExpLastPage.last() as Sku)?.code

        if (startId) expCreate.filters.code_gt = startId
        expCreate.filters.code_lteq = stopId

        const exp = await cl.exports.create(expCreate)

        exp.metadata = { exportName, exportRecords: exp.records_count || 0 }
        if (!blindMode) spinners.update(exportName, { text: `${exportName} ${exp.status}`.replace(/_/g, ' ') })

        exports.push(exp)

        startId = stopId

      }


      const checkDelay = clApi.requestRateLimitDelay({
        resourceType: 'exports',
        parallelRequests: Math.min(totExports, MAX_QUEUE_LENGTH),
        environment: this.environment,
        minimumDelay: 1000
      })

      while (!exportCompleted(exports)) {
        for (const exp of exports) {

          const expUpd = await cl.exports.retrieve(exp.id)
          expUpd.metadata = exp.metadata
          Object.assign(exp, expUpd)

          if (!blindMode) {
            const exportName = exp.metadata?.exportName
            if (spinners.pick(exportName)) {
              spinners.update(exportName, { text: `${exportName} ${exp.status}`.replace(/_/g, ' ') })
              if (exp.status === 'completed') spinners.succeed(exportName)
            }
          }

        }
        await clUtil.sleep(checkDelay)
      }

      this.log(`\nExport of ${clColor.yellowBright(String(totRecords))} ${resDesc} ${this.exportStatus('completed')}.\n`)

      if (exports.some(e => !e.attachment_url)) this.error('Something went wrong creating export files')

      let outputFile: string | undefined
      let exportOk = false
      if (totExports === 1) {
        outputFile = await this.saveOutput(exports[0], flags)
        exportOk = true
      }
      else {

        if (!blindMode && !flags.quiet) cliux.action.start('Checking and merging exported files')
        const tmpOutputFile = await this.mergeExportFiles(exports, flags)
        const checkOk = this.checkExportedFile(totRecords, readFileSync(tmpOutputFile, { encoding }), format)
        if (!checkOk) this.error('Check of generated merged file failed')
        if (!blindMode) cliux.action.stop()

        outputFile = await this.saveOutput(tmpOutputFile, flags)
        unlinkSync(tmpOutputFile)
        exportOk = true

      }
  

      if (!exportOk) this.error('Something went wrong saving the export file on disk')

      // Notification
      const finishMessage = `Export of ${totRecords} ${resDesc} is finished!`
      if (blindMode) this.log(finishMessage)
      else {
        if (notification) notify(finishMessage)
        if (flags.open && outputFile){
          this.log('APERTO!!')
          await open(outputFile)
        }
      }

    } catch (error: any) {
      if (cl.isApiError(error) && (error.status === 422)) this.handleExportError(error, resDesc)
      else this.handleError(error)
    }

  }


  private cleanExportFile(exportFile: string, format: string): string {

    let cleaned = exportFile

    switch (format) {
      case 'json': {
        // Remove start and end square brackets
        cleaned = exportFile.slice(1, exportFile.length - 1)
        break
      }
      case 'csv': {
        // Remove header
        const eol = exportFile.indexOf('\n')
        if (eol > -1) cleaned = exportFile.slice(eol + 1)
        break
      }
    }

    return cleaned
    
  }


  private checkExportedFile(numRecords: number, expFile: string, format: string, cleaned = false): boolean {

    let expRecords = -1

    switch (format) {
      case 'csv': {
        expRecords = (expFile.match(/(?:"(?:[^"]|"")*"|[^,\n]*)(?:,(?:"(?:[^"]|"")*"|[^,\n]*))*\n/g) || []).length
        if (!cleaned) expRecords--
        break
      }
      case 'json': {
        expRecords = (JSON.parse(expFile) as any[]).length
        break
      }
    }

    // this.log(`records: ${numRecords} - exported: ${expRecords}`)

    return numRecords === expRecords

  }


  private async mergeExportFiles(exports: Export[], flags: any): Promise<string> {

    // const tmpDir = this.config.cacheDir
    const tmpDir = join(this.config.home, 'desktop')
    const format = this.getFileFormat(flags)

    const mergedFile = join(tmpDir, `${exports[0].reference?.split('-')[0] as string}.${format}`)
    if (format === 'json') writeFileSync(mergedFile, `[${flags.prettify ? '\n\t' : ''}`, { flag: 'a', encoding })

    let exportCounter = 0

    for (const e of exports) {

      const fileExport = await this.getExportedFile(e.attachment_url, flags)
      exportCounter++

      if ((exportCounter === 1)) {
        if (format === 'csv') { // Write csv header at the beginning of the merged file
          const header = fileExport.substring(0, fileExport.indexOf('\n'))
          if (header) writeFileSync(mergedFile, `${header}\n`, { flag: 'a', encoding })
        }
      } else {
        if (format === 'json') {  // Add comma between exported files
          writeFileSync(mergedFile, `,${flags.prettify ? '\n\t' : ''}`, { flag: 'a', encoding })
        }
      }

      const checkOk = this.checkExportedFile(e.metadata?.exportRecords || 0, fileExport, format)
      if (!checkOk) this.error(`Check of exported file n.${exportCounter} failed`)

      const fileText = this.cleanExportFile(fileExport, format)
      if (flags.keep) writeFileSync(join(tmpDir, `${(e.reference || e.id)}${e.reference ? `-${e.id}` : ''}.${format}`), fileText, { encoding })
      writeFileSync(mergedFile, fileText, { flag: 'a', encoding })

    }

    if (format === 'json') writeFileSync(mergedFile, `${flags.prettify ? '\n' : ''}]`, { flag: 'a', encoding })

    return mergedFile

  }

}
