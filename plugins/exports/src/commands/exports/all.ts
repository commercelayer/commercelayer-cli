import ExportsCreate from './create'
import { ExportCommand, notify, Flags, encoding, type ExportFormat } from '../../base'
import { type KeyValString, clApi, clColor, clConfig, clUtil } from '@commercelayer/cli-core'
import type { Export, ExportCreate, ListableResourceType, QueryParamsList, ResourceTypeLock } from '@commercelayer/sdk'
import Spinnies from 'spinnies'
import open from 'open'
import { readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { CommandError } from '@oclif/core/lib/interfaces'
import * as cliux from '@commercelayer/cli-ux'



const DEBUG = ['1', 'on', 'true', 'export'].includes((process.env.CL_CLI_DEBUG || '').toLowerCase())
if (DEBUG) console.log('\nDEBUG MODE ON')

const ALLOW_OVERQUEUING = true // Allow to bypass the limit of concurrent exports
const MAX_QUEUE_LENGTH = Math.floor(clConfig.exports.max_queue_length / 2) - 1

const MIN_EXPORT_SIZE = 1_000
const MAX_EXPORT_SIZE = clConfig.exports.max_size || 5_000


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
  fields?: string[],
  dryData: boolean,
  blindMode: boolean,
  exportSize: number
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


const spinnerText = (exp: Export | string, maxExpSize?: number): string => {
  if (typeof exp === 'string') return exp
  else {
    const details = ` [${exp.id}, ${String(exp.metadata?.exportRecords).padEnd(String(maxExpSize|| MAX_EXPORT_SIZE).length, ' ')} ${exp.resource_type}]`
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
  static disabled = true

  static description = 'export all the records'

  static aliases = ['exp:all', 'export']

  static examples = [
    '$ commercelayer exports:all -t orders -f number -X <output-file-path>',
    '$ cl exp:all -t customers -i customer_subscriptions -w email_end=@test.org -X <output-file-path>',
    '$ cl export -t skus -w code_start=SHIRT -X <output-file-path> --csv'
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
    }),
    size: Flags.integer({
      char: 'S',
      description: `max number of records for each export [${MIN_EXPORT_SIZE}-${MAX_EXPORT_SIZE}]`,
      min: MIN_EXPORT_SIZE,
      max: MAX_EXPORT_SIZE
    })
  }



  public async run(): Promise<void> {

    if (ExportsAll.disabled) this.error(`This command has been deprecated, please use instead the updated version of the command ${clColor.cli.command('exports:create')} that now supports big exports`, { exit: 2 })

    const { flags } = await this.parse(ExportsAll)

    const accessToken = flags.accessToken
    this.checkApplication(accessToken, ['integration', 'cli'])

    const outputPath = flags.save || flags['save-path']
    if (!outputPath) this.error('Undefined output file path')

    const format = this.getFileFormat(flags)
    if (flags.prettify && (format === 'csv')) this.error(`Flag ${clColor.cli.flag('Prettify')} can only be used with ${clColor.cli.value('JSON')} format`)

    const resType = flags.type as ResourceTypeLock
    this.checkResource(resType)
    const resDesc = resType.replace(/_/g, ' ')

    const blindMode = flags.blind || false

    // Include flags
    const include: string[] = this.includeFlag(flags.include)
    // Where flags
    const wheres = this.whereFlag(flags.where)
    // Fields flags
    const fields = this.fieldsFlag(flags.fields)


    const exportSize = flags.size || MAX_EXPORT_SIZE


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
      blindMode,
      exportSize
    }


    if (include && (include.length > 0)) exportJob.include = include
    if (wheres && (Object.keys(wheres).length > 0)) exportJob.filter = wheres
    else exportJob.filter = {}
    if (fields && (fields.length > 0)) exportJob.fields = fields


    try {

      this.commercelayerInit(flags)
      const resSdk = this.cl[resType as ListableResourceType] as any

      // [2024-09-04] Sort is used to force PG to use the correct index
      const filter: QueryParamsList = { filters: wheres, pageSize: 1, pageNumber: 1, sort: ['created_at', 'id'] }

      // Handle malformed requests before initializing the export
      await resSdk.list({ ...filter, include }).catch((err: unknown) => {
        this.error('Error initializing export process, please try again', { exit: false })
        this.handleError(err as CommandError)
      })

      const totRecords = await resSdk.count(filter)
      if (totRecords === 0) {
        this.log(`\n${clColor.italic('Nothing to export')}\n`)
        this.exit()
      } else exportJob.totalRecords = totRecords

  
      const totExports = Math.ceil(totRecords / exportSize)
      exportJob.totalExports = totExports

      // Check if export needs to be split
      await this.checkMultiExport(exportJob, flags)

      // Create export resources (and monitor jobs execution)
      const exports = await this.createExports(exportJob)
      if (exports.some(e => !e.attachment_url)) this.error('Something went wrong creating export files')

      const outputFile = await this.saveExportOutput(exportJob, flags)
      if (!outputFile) this.error('Something went wrong saving the export file')

      if (flags.keep) this.log(clColor.italic(`Original export file saved to ${this.config.cacheDir}\n`))

      // Notification
      const finishMessage = `Export of ${totRecords} ${resDesc} is finished!`
      if (blindMode) this.log(finishMessage)
      else {
        if (flags.notify) notify(finishMessage)
        if (flags.open && outputFile) await open(outputFile)
      }

    } catch (error) {
      if (this.cl.isApiError(error) && (error.status === 422)) this.handleExportError(error, resDesc)
      else this.handleError(error as CommandError)
    }

  }


  private async saveExportOutput(expJob: ExportJob, flags: any): Promise<string | undefined> {

    const exports = expJob.exports

    let tmpOutputFile: string
    let exportOk = false
    if (expJob.totalExports === 1) {
      if (!expJob.blindMode && !flags.quiet) this.log('Single file export')
      tmpOutputFile = await this.singleExportFile(exports[0], flags)
    }
    else {
      if (!expJob.blindMode && !flags.quiet) cliux.action.start('Checking and merging exported files')
      tmpOutputFile = await this.mergeExportFiles(exports, flags)
      const fileSize = statSync(tmpOutputFile).size
      if (DEBUG) console.log(`Merged export file size: ${fileSize} bytes`)
      if (fileSize < (512 * 1024 * 1024)) {
        const checkOk = this.checkExportedFile(expJob.totalRecords, readFileSync(tmpOutputFile, { encoding }), expJob.format)
        if (!checkOk) this.error('Check of generated merged file failed')
      }
      if (!expJob.blindMode) cliux.action.stop()
    }

    if (DEBUG) console.log('Move temp file to output path')
    const outputFile = await this.saveOutput(tmpOutputFile, flags)
    exportOk = true
    if (DEBUG) console.log('Done.')


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
          spinners.update(exportName, { text: spinnerText(exp, expJob.exportSize) })
          if (exportCompleted(exp)) spinners.succeed(exportName)
        }
      }

    }

  }


  private async createExports(expJob: ExportJob): Promise<Export[]> {

    this.log(`\nExporting ${clColor.yellowBright(expJob.totalRecords)} ${expJob.resourceDesc} ...`)

    const resSdk = this.cl[expJob.resourceType as ListableResourceType] as any

    const expCreate: ExportCreate = {
      resource_type: expJob.resourceType,
      format: expJob.format,
      dry_data: expJob.dryData,
      reference: expJob.groupId,
      reference_origin: 'cli-plugin-exports',
      includes: expJob.include,
      filters: { ...expJob.filter },
      fields: expJob.fields
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

    const reference = expCreate.reference


    while (!exportCompleted(exports)) {

      for (let curExp = 0; curExp < exports.length; curExp++) {

        if ((countRunning(exports) < MAX_QUEUE_LENGTH) && !exports[curExp].id) {

          const curIdx = curExp + 1
          const exportName = `Export_${curIdx}`
          if (expJob.totalExports > 1) expCreate.reference = `${reference}-${curIdx}`

          if (!expJob.blindMode) spinners.add(spinnerText(exportName), { text: `${exportName} initializing` })

          // Export split simulation ...
          // 1500  --> 1: 1500,  2: x
          // 10000 --> 1: 10000, 2: x
          // 15000 --> 1: 10000, 2: 5000,  3: x
          // 20000 --> 1: 10000, 2: 10000, 3: x
          // 25000 --> 1: 10000, 2: 10000, 3: 5000, 4: x

          const pageSize = 1  // clConfig.api.page_max_size
          const curExpRecords = Math.min(expJob.exportSize, expJob.totalRecords - (expJob.exportSize * curExp))
          const curExpPages = Math.ceil(curExpRecords / pageSize)
          expPage += curExpPages

          const filter: QueryParamsList = { filters: expJob.filter, pageSize, pageNumber: expPage, sort: { id: 'asc' } }

          const curExpLastPage = await resSdk.list(filter)

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
        const msg1 = flags.size? '' : `You have requested to export ${clColor.yellowBright(expJob.totalRecords)} ${expJob.resourceDesc}, more than the maximun ${MAX_EXPORT_SIZE} elements allowed for each single export. `
        const msg2 = `The export will be split into a set of ${clColor.yellowBright(expJob.totalExports)} distinct exports with the same unique group ID ${clColor.underline.yellowBright(groupId)}.`
        const msg3 = ` Execute the command ${clColor.cli.command(`exports:group ${groupId}`)} to retrieve all the related exports.`
        this.log(`\n${msg1}${msg2}${msg3}`)
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

    if (DEBUG) console.log(`numRecords: ${numRecords}, expRecords: ${expRecords}`)

    return numRecords === expRecords

  }


  private async mergeExportFiles(exports: Export[], flags: any): Promise<string> {

    const tmpDir = this.config.cacheDir
    const format = this.getFileFormat(flags)

    const mergedFile = join(tmpDir, `${exports[0].reference?.split('-')[0] ?? ''}.${format}`)
    if (format === 'json') writeFileSync(mergedFile, `[${flags.prettify ? '\n\t' : ''}`, { flag: 'a', encoding })

    let exportCounter = 0

    for (const e of exports) {
      const expFresh = await this.cl.exports.retrieve(e)  // Retrieve needed to resfresh S3 url
      e.attachment_url = expFresh.attachment_url

      if (DEBUG) console.log(`Getting file ${e.attachment_url} [${e.id}]`)
      const fileExport = await this.getExportedFile(e.attachment_url, flags)
      exportCounter++
      if (DEBUG) console.log('Done.')

      if ((exportCounter === 1)) {
        if (format === 'csv') { // Write csv header at the beginning of the merged file
          const header = fileExport.substring(0, fileExport.indexOf('\n'))
          if (header) writeFileSync(mergedFile, `${header}\n`, { flag: 'a', encoding })
        }
      } else {
        if (format === 'json') {  // Add comma between exported json files
          writeFileSync(mergedFile, `,\n${flags.prettify ? '\t' : ''}`, { flag: 'a', encoding })
        }
      }
      if (DEBUG) console.log(`Checking file [${e.id}]`)
      const checkOk = this.checkExportedFile(e.metadata?.exportRecords as number || 0, fileExport, format)
      if (!checkOk) this.error(`Check of exported file n.${exportCounter} failed`)
      else if (DEBUG) console.log('Done.')

      if (DEBUG) console.log(`Cleaning and saving file [${e.id}]`)
      const fileText = this.cleanExportFile(fileExport, format)
      if (flags.keep) writeFileSync(join(tmpDir, `${(e.reference || e.id)}${e.reference ? `-${e.id}` : ''}.${format}`), fileText, { encoding })
      writeFileSync(mergedFile, fileText, { flag: 'a', encoding })
      if (DEBUG) console.log('Done.')

    }

    if (format === 'json') writeFileSync(mergedFile, `${flags.prettify ? '\n' : ''}]`, { flag: 'a', encoding })


    return mergedFile

  }

}
