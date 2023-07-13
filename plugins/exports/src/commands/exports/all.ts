import ExportsCreate from './create'
import { ExportCommand, cliux, notify, Flags, encoding, type ExportFormat } from '../../base'
import { type KeyValString, clApi, clColor, clConfig, clUtil } from '@commercelayer/cli-core'
import type { Export, ExportCreate } from '@commercelayer/sdk'
import type { ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import Spinnies from 'spinnies'
import open from 'open'
import { readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'


const ALLOW_OVERQUEUING = true // Allow to bypass the limit of concurrent exports
const MAX_QUEUE_LENGTH = Math.floor(clConfig.exports.max_queue_length / 2) - 1
const MAX_EXPORT_SIZE = clConfig.exports.max_size


type Spinners = typeof Spinnies

type ExportJob = {
  groupId: string,
  totalRecords: number,
  totalExports: number,
  exports: Export[],
  spinners?: Spinners,
  format: ExportFormat
  resourceType: string,
  resourceDesc: string,
  include?: string[],
  filter?: KeyValString,
  dryData: boolean,
  blindMode: boolean
}


const exportCompleted = (exports: Export[] | Export): boolean => {
  if (Array.isArray(exports)) return !exports.some(exp => exp.status !== 'completed')
  else return exports.status === 'completed'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const countCompleted = (exports: Export[] | ExportJob): number => {
  let completed = 0
  for (const e of (Array.isArray(exports) ? exports : exports.exports)) if (e.status === 'completed') completed++
  return completed
}

const countRunning = (exports: Export[] | ExportJob): number => {
  let running = 0
  for (const e of (Array.isArray(exports) ? exports : exports.exports)) if (e.id && ['pending', 'in_progress'].includes(e.status)) running++
  return running
}


const spinnerText = (exp: Export | string): string => {
  if (typeof exp === 'string') return exp
  else {
    const details = ` [${exp.id}, ${String(exp.metadata?.exportRecords).padEnd(String(MAX_EXPORT_SIZE).length, ' ')} ${exp.resource_type}]`
    return `${exp.metadata?.exportName} ${exp.status}${details}`.replace(/_/g, ' ')
  }
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

    const format = this.getFileFormat(flags)
    if (flags.prettify && (format === 'csv')) this.error(`Flag ${clColor.cli.flag('Prettify')} can only be used with ${clColor.cli.value('JSON')} format`)

    const resType = flags.type
    if (!clConfig.exports.types.includes(resType)) this.error(`Unsupported resource type: ${clColor.style.error(resType)}`)
    const resDesc = resType.replace(/_/g, ' ')

    const blindMode = flags.blind || false

    // Include flags
    const include: string[] = this.includeFlag(flags.include)
    // Where flags
    const wheres = this.whereFlag(flags.where)


    const exportJob: ExportJob = {
      groupId: '',
      totalRecords: 0,
      totalExports: 0,
      exports: [],
      format,
      resourceType: resType,
      resourceDesc: resDesc,
      include,
      filter: wheres,
      dryData: flags['dry-data'],
      blindMode
    }


    if (include && (include.length > 0)) exportJob.include = include
    if (wheres && (Object.keys(wheres).length > 0)) exportJob.filter = wheres
    else exportJob.filter = {}


    try {

      this.commercelayerInit(flags)
      const resSdk = this.cl[resType as ListableResourceType]

      const totRecords = await resSdk.count({ filters: wheres, pageSize: 1, pageNumber: 1 })
      exportJob.totalRecords = totRecords

      const totExports = Math.ceil(totRecords / MAX_EXPORT_SIZE)
      exportJob.totalExports = totExports

      // Check if export needs to be split
      await this.checkMultiExport(exportJob, flags)

      // Create export resources
      const exports = await this.createExports(exportJob)
      if (exports.some(e => !e.attachment_url)) this.error('Something went wrong creating export files')

      const outputFile = await this.saveExportOutput(exportJob, flags)
      if (!outputFile) this.error('Something went wrong saving the export file')

      // Notification
      const finishMessage = `Export of ${totRecords} ${resDesc} is finished!`
      if (blindMode) this.log(finishMessage)
      else {
        if (flags.notify) notify(finishMessage)
        if (flags.open && outputFile) await open(outputFile)
      }

    } catch (error: any) {
      if (this.cl.isApiError(error) && (error.status === 422)) this.handleExportError(error, resDesc)
      else this.handleError(error)
    }

  }


  private async saveExportOutput(expJob: ExportJob, flags: any): Promise<string | undefined> {

    const exports = expJob.exports

    let outputFile: string | undefined
    let exportOk = false
    if (expJob.totalExports === 1) {
      outputFile = await this.saveOutput(exports[0], flags)
      exportOk = true
    }
    else {

      if (!expJob.blindMode && !flags.quiet) cliux.action.start('Checking and merging exported files')
      const tmpOutputFile = await this.mergeExportFiles(exports, flags)
      const checkOk = this.checkExportedFile(expJob.totalRecords, readFileSync(tmpOutputFile, { encoding }), expJob.format)
      if (!checkOk) this.error('Check of generated merged file failed')
      if (!expJob.blindMode) cliux.action.stop()

      outputFile = await this.saveOutput(tmpOutputFile, flags)
      unlinkSync(tmpOutputFile)
      exportOk = true

    }


    return exportOk ? outputFile : undefined

  }


  private async monitorExports(expJob: ExportJob): Promise<void> {

    const exports = expJob.exports
    const spinners = expJob.spinners

    for (const exp of exports) {

      if (!exp.id || exportCompleted(exp)) continue

      const expUpd = await this.cl.exports.retrieve(exp.id)

      expUpd.metadata = exp.metadata
      Object.assign(exp, expUpd)

      if (!expJob.blindMode) {
        const exportName = exp.metadata?.exportName
        if (spinners.pick(exportName)) {
          spinners.update(exportName, { text: spinnerText(exp) })
          if (exportCompleted(exp)) spinners.succeed(exportName)
        }
      }

    }

  }


  private async createExports(expJob: ExportJob): Promise<Export[]> {

    this.log(`\nExporting ${clColor.yellowBright(expJob.totalRecords)} ${expJob.resourceDesc} ...`)

    const resSdk = this.cl[expJob.resourceType as ListableResourceType]

    const expCreate: ExportCreate = {
      resource_type: expJob.resourceType,
      format: expJob.format,
      dry_data: expJob.dryData,
      reference: expJob.groupId,
      reference_origin: 'cli-plugin-exports',
      includes: expJob.include,
      filters: { ...expJob.filter }
    }

    if (!expCreate.filters) expCreate.filters = {}


    const exports: Export[] = []
    let startId = null
    let stopId = null
    let expPage = 0

    // Initialize local export queue
    for (let curExp = 0; curExp < expJob.totalExports; curExp++) {
      exports.push({ type: 'exports', id: '', resource_type: expJob.resourceType, status: 'pending', created_at: '', updated_at: '' })
    }
    expJob.exports = exports

    // Initialize spinners if not in blind mode
    let spinners: Spinners
    if (!expJob.blindMode) {
      spinners = new Spinnies()
      expJob.spinners = spinners
    }

    // Compute requests delay
    const checkDelay = clApi.requestRateLimitDelay({
      resourceType: 'exports',
      parallelRequests: Math.min(expJob.totalExports, MAX_QUEUE_LENGTH),
      environment: this.environment,
      minimumDelay: 1000
    })


    while (!exportCompleted(exports)) {

      for (let curExp = 0; curExp < exports.length; curExp++) {

        if ((countRunning(exports) < MAX_QUEUE_LENGTH) && !exports[curExp].id) {

          const curIdx = curExp + 1
          const exportName = `Export_${curIdx}`
          if (expJob.totalExports > 1) expCreate.reference = `${expCreate.reference}-${curIdx}`

          if (!expJob.blindMode) spinners.add(spinnerText(exportName))

          // Export split simulation ...
          // 1500  --> 1: 1500,  2: x
          // 10000 --> 1: 10000, 2: x
          // 15000 --> 1: 10000, 2: 5000,  3: x
          // 20000 --> 1: 10000, 2: 10000, 3: x
          // 25000 --> 1: 10000, 2: 10000, 3: 5000, 4: x

          const curExpRecords = Math.min(MAX_EXPORT_SIZE, expJob.totalRecords - (MAX_EXPORT_SIZE * curExp))
          const curExpPages = Math.ceil(curExpRecords / clConfig.api.page_max_size)
          expPage += curExpPages

          const curExpLastPage = await resSdk.list({ filters: expJob.filter, pageSize: clConfig.api.page_max_size, pageNumber: expPage, sort: { id: 'asc' } })

          stopId = curExpLastPage.last()?.id

          if (startId) expCreate.filters.id_gt = startId
          expCreate.filters.id_lteq = stopId

          const exp = await this.cl.exports.create(expCreate)

          exp.metadata = { exportName, exportRecords: exp.records_count || 0 }
          if (!expJob.blindMode) spinners.update(exportName, { text: spinnerText(exp) })

          exports[curExp] = exp

          startId = stopId

        }

      }

      await clUtil.sleep(checkDelay)
      await this.monitorExports(expJob)
      await clUtil.sleep(checkDelay)

    }


    this.log(`\nExport of ${clColor.yellowBright(String(expJob.totalRecords))} ${expJob.resourceDesc} ${this.exportStatus('completed')}.\n`)

    return exports

  }



  private async checkMultiExport(expJob: ExportJob, flags: any): Promise<void> {

    if ((expJob.totalExports > MAX_QUEUE_LENGTH) && !ALLOW_OVERQUEUING)
      this.error(`The number of exports (${clColor.msg.error(expJob.totalExports)}) exceeds the maximum allowed (${clColor.yellowBright(MAX_QUEUE_LENGTH)})`, {
        suggestions: ['Add more filters to reduce the number of export that will be created']
      })

    if (expJob.totalExports > 1) {

      const groupId = generateGroupUID()
      expJob.groupId = groupId

      if (!flags.quiet) {
        const msg1 = `You have requested to export ${clColor.yellowBright(expJob.totalRecords)} ${expJob.resourceDesc}, more than the maximun ${MAX_EXPORT_SIZE} elements allowed for each single export.`
        const msg2 = `The export will be split into a set of ${clColor.yellowBright(expJob.totalExports)} distinct exports with the same unique group ID ${clColor.underline.yellowBright(groupId)}.`
        const msg3 = `Execute the command ${clColor.cli.command(`exports:group ${groupId}`)} to retrieve all the related exports`
        this.log(`\n${msg1} ${msg2} ${msg3}`)
        this.log()
        await cliux.anykey()
      }

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


    return numRecords === expRecords

  }


  private async mergeExportFiles(exports: Export[], flags: any): Promise<string> {

    const tmpDir = this.config.cacheDir
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
          writeFileSync(mergedFile, `,\n${flags.prettify ? '\t' : ''}`, { flag: 'a', encoding })
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
