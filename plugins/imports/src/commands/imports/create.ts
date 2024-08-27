/* eslint-disable no-await-in-loop */
import Command, { Flags, cliux } from '../../base'
import type { CommerceLayerClient, Import } from '@commercelayer/sdk'
import { generateInputs } from '../../input'
import type { SingleBar } from 'cli-progress'
import { clUtil, clConfig, clColor, type ApiMode, clApi } from '@commercelayer/cli-core'
import { Monitor } from '../../monitor'
import { type Chunk, type Batch, splitChunks, splitImports } from '../../chunk'



const MAX_INPUTS = 0	// 0 = No Max
const MAX_CHUNKS = clConfig.imports.max_queue_length || 10
const MIN_DELAY = 1000
const ERROR_429_DELAY = 10_000
const SECURITY_DELAY = 50



const importsDelay = (parallelRequests: number, env?: ApiMode): number => {

  /*
  const corrFact = (env === 'live')? 1 : 2

  const unitDelayBurst = clConfig.api.requests_max_secs_burst / (clConfig.api.requests_max_num_burst / corrFact)
  const unitDelayAvg = clConfig.api.requests_max_secs_avg / (clConfig.api.requests_max_num_avg / corrFact)

  const delayBurst = parallelRequests * unitDelayBurst
  const delayAvg = parallelRequests * unitDelayAvg

  const delay = Math.ceil(Math.max(delayBurst, delayAvg) * 1000)

  const secDelay = Math.max(MIN_DELAY, delay + SECURITY_DELAY)

  return secDelay
  */

  return clApi.requestRateLimitDelay({
    minimumDelay: MIN_DELAY,
    securityDelay: SECURITY_DELAY,
    environment: env
  })

}


export default class ImportsCreate extends Command {

  static description = 'create a new import'

  static aliases = ['imp:create', 'import']

  static examples = [
    '$ commercelayer imports:create -t stock_items -p <stock_location-id> -i <input-file-path>',
    '$ cl imp:create -t skus -i <input-file-path>',
  ]

  static flags = {
    type: Flags.string({
      char: 't',
      description: 'the type of resource being imported',
      required: true,
      options: clConfig.imports.types as string[],
      helpValue: clConfig.imports.types.slice(0, 4).join('|') + '|...',
      multiple: false,
    }),
    parent: Flags.string({
      char: 'p',
      description: 'the id of the parent resource to be associated with imported data',
    }),
    /*
    cleanup: Flags.boolean({
      char: 'c',
      description: 'delete all other existing items',
      deprecated: { message: `The ${clColor.msg.error('cleanup')} flag has been deprecated. Use the ${clColor.blueBright('cleanups')} plugin instead.` }
    }),
    */
    inputs: Flags.string({
      char: 'i',
      description: 'the path of the file containing the data to import',
      required: true,
    }),
    csv: Flags.boolean({
      char: 'C',
      description: 'accept input file in CSV format',
      dependsOn: ['inputs'],
    }),
    /*
    delimiter: Flags.string({
      char: 'D',
      description: 'the delimiter character used in the CSV input file (one of \',\', \';\', \'|\', TAB)',
      options: [',', ';', '|', 'TAB'],
      dependsOn: ['csv'],
      multiple: false
    }),
    */
    blind: Flags.boolean({
      char: 'b',
      description: 'execute in blind mode without showing the progress monitor',
      exclusive: ['quiet', 'silent'],
    }),
    quiet: Flags.boolean({
      char: 'q',
      description: 'execute command without showing warning messages',
      exclusive: ['blind'],
    }),
  }


  cl!: CommerceLayerClient

  monitor!: Monitor

  private completed = 0


  async run(): Promise<any> {

    const { flags } = await this.parse(ImportsCreate)

    // Check application kind
    this.checkApplication(flags.accessToken, ['integration', 'cli'])

    this.cl = this.commercelayerInit(flags)

    // Check access to API before executing the command
    await this.checkAccessToken()


    try {

      const type = flags.type
      if (!clConfig.imports.types.includes(type)) this.error(`Unsupported resource type: ${clColor.style.error(type)}`)

      const format = flags.csv ? 'csv' : 'json'

      const parentId = flags.parent
      const inputFile = clUtil.specialFolder(flags.inputs)

      const monitor = !flags.blind

      const inputs: any[] = await generateInputs(inputFile, format).catch(error => this.error((error as Error).message))
      const inputsLength = (format === 'csv')? Math.max(0, inputs.length-1) : inputs.length

      // Check import size
      const humanized = clApi.humanizeResource(type)
      if (inputsLength === 0) this.error(`No ${humanized} to import`)
      else {
        if ((MAX_INPUTS > 0) && (inputsLength > MAX_INPUTS)) this.error(`You are trying to import ${clColor.yellowBright(inputsLength)} ${humanized}. Using the CLI you can import up to ${MAX_INPUTS} items at a time`, {
          suggestions: [`Split your input file into multiple files containing each a maximum of ${MAX_INPUTS} items`],
        })
        /*
        if (flags.cleanup && (inputsLength > clConfig.imports.max_size))
          this.error(`You can use the ${clColor.cli.flag('cleanup')} flag only with imports that contains less than ${clColor.yellowBright(clConfig.imports.max_size)} items. Currently you are trying to import ${clColor.cli.value(inputsLength)} items.`, {
            suggestions: [`If you need to cleanup execute a first import with less items (even just one) or use the ${clColor.api.resource('cleanups')} resource to have the job done.`],
          })
        */
      }

      // Split input
      const chunks: Chunk[] = splitImports({
        resource_type: type,
        parent_resource_id: parentId,
        // cleanup_records: flags.cleanup,
        inputs
      }, format)

      // Split chunks
      const batches: Batch[] = splitChunks(chunks, MAX_CHUNKS)


      const resource = type.replace(/_/g, ' ')
      const multiChunk = chunks.length > 1
      const multiBatch = batches.length > 1

      // Show multi chunk/batch messages
      if (!flags.quiet && !flags.blind) {
        // Multi chunk message
        if (multiChunk) {
          const groupId = chunks[0]?.group_id
          const msg1 = `The input file contains ${clColor.yellowBright(String(inputsLength))} ${resource}, more than the maximun ${clConfig.imports.max_size} elements allowed for each single import.`
          const msg2 = `The import will be split into a set of ${clColor.yellowBright(String(chunks.length))} distinct chunks with the same unique group ID ${clColor.underline.yellowBright(groupId)}.`
          const msg3 = `Execute the command ${clColor.cli.command(`imports:group ${groupId}`)} to retrieve all the related imports`
          this.log(`\n${msg1} ${msg2} ${msg3}`)
        }

        // Multi batch message
        if (multiBatch) {
          const msg1 = `The ${chunks.length} generated chunks will be elaborated in batches of ${MAX_CHUNKS}`
          this.log(`\n${msg1}`)
        }

        if (multiChunk || multiBatch) {
          this.log()
          await cliux.anykey()
        }
      }


      if (monitor) {
        let withErrors = false
        for (const batch of batches) {
          if (multiBatch) this.log(`\nProcessing batch # ${clColor.yellowBright(String(batch.batch_number))} of ${clColor.yellowBright(String(batch.total_batches))}...`)
          this.monitor = Monitor.create(batch.items_count, clUtil.log)
          const impOk = await this.parallelizeImports(batch.chunks, monitor)
          withErrors ||= !impOk
        }

        this.log(`\n${clColor.reset('Import of')} ${clColor.yellowBright(String(inputsLength))} ${humanized} completed${withErrors ? ' with errors' : ''}.`)
      } else {
        await this.parallelizeImports(chunks, monitor)
        this.log(`\nThe import of ${clColor.yellowBright(String(inputsLength))} ${resource} has been started`)
      }

      this.log()


    } catch (error: any) {
      this.handleError(error as Error, flags)
    }

  }


  private async checkAccessToken(): Promise<void> {
    try {
      await this.cl.application.retrieve()
    } catch (error) {
      if (this.cl.isApiError(error) && error.status && (error.status >= 400)) {
        const err = error.first()
        this.error(`${err.title}: ${err.detail}`)
      }
    }
  }


  private async parallelizeImports(chunks: Chunk[], monitor: boolean): Promise<boolean> {

    const imports: Array<Promise<Import>> = []

    this.completed = 0
    for (const chunk of chunks) {
      const imp = this.createParallelImport(chunk, monitor)
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      if (imp) imports.push(imp)
    }

    if (monitor && this.monitor) {
      const results = await Promise.allSettled(imports)
      this.monitor.stop()
      return !results.some((r: any) => ((r.value === undefined) || (r.value.status === 'interrupted') || (r.value.errors_count > 0) || (r.status === 'rejected')))
    }

    return true

  }


  private async createImport(chunk: Chunk): Promise<Import> {
    const inputs = (chunk.format === 'json')? chunk.inputs : (chunk.inputs.join('\n') as unknown as Array<Record<string, any>>) // fix inputs resource type issue
    return this.cl.imports.create({
      format: chunk.format,
      resource_type: chunk.resource_type,
      parent_resource_id: chunk.parent_resource_id,
      // cleanup_records: chunk.cleanup_records,
      inputs,
      reference: `${chunk.group_id}-${String(chunk.chunk_number).padStart(4, '0')}`,
      reference_origin: 'cli-plugin-imports',
      metadata: {
        chunk_number: `${chunk.chunk_number}/${chunk.total_chunks}`,
        chunk_items: `${chunk.start_item}-${chunk.end_item}`,
        group_id: chunk.group_id
      }
    })
  }


  private async createParallelImport(chunk: Chunk, monitor?: boolean): Promise<Import> {

    let bar: SingleBar

    if (monitor && this.monitor) bar = this.monitor.createBar(chunk)

    return this.createImport(chunk).then(async i => {

      let imp: Import = i
      if (monitor && this.monitor) {

        let barValue = 0
        if (bar) barValue = this.monitor.updateBar(bar, 0, { importId: i.id, status: 'waiting...' })

        do {

          await clUtil.sleep(importsDelay(chunk.total_batch_chunks - this.completed, this.environment))
          const tmp = await this.cl.imports.retrieve(imp.id).catch(async error => {
            if (this.cl.isApiError(error) && (error.status === 429)) {
              if (imp?.status) barValue = this.monitor.updateBar(bar, barValue, { status: clColor.cyanBright(imp.status) })
              await clUtil.sleep(ERROR_429_DELAY)
            }
          })

          if (tmp) {
            imp = tmp
            if (bar) barValue = this.monitor.updateBar(bar, undefined, {
              processed: Number(imp.processed_count),
              warnings: Number(imp.warnings_count),
              errors: Number(imp.errors_count),
              status: imp.status
            })
          }

        }
        while (!['completed', 'interrupted'].includes(imp.status || ''))

        this.completed++

      }


      return imp

    }).catch(async error => {
      this.monitor.updateBar(bar, undefined, { message: this.monitor.message(/* error.message || */'Error', 'error') })
      // console.log(error)
      return Promise.reject(error)
    })

  }

}
