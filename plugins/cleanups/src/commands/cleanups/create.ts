import Command, { Flags, cliux } from '../../base'
import type { Cleanup, CommerceLayerClient } from '@commercelayer/sdk'
import type { SingleBar } from 'cli-progress'
import { clUtil, clConfig, clColor, clApi } from '@commercelayer/cli-core'
import { Monitor } from '../../monitor'
import { type Chunk, type Batch, splitChunks, splitRecords } from '../../chunk'



const MAX_RECORDS = 10_000	// 0 = No Max
const MAX_CHUNKS = 10
const MIN_DELAY = 1000
const ERROR_429_DELAY = 10_000
const SECURITY_DELAY = 50



const requestDelay = (parallelRequests: number): number => {
/*
  const unitDelayBurst = clConfig.api.requests_max_secs_burst / clConfig.api.requests_max_num_burst
  const unitDelayAvg = clConfig.api.requests_max_secs_avg / clConfig.api.requests_max_num_avg

  const delayBurst = parallelRequests * unitDelayBurst
  const delayAvg = parallelRequests * unitDelayAvg

  const delay = Math.ceil(Math.max(delayBurst, delayAvg) * 1000)

  const secDelay = Math.max(MIN_DELAY, delay + SECURITY_DELAY)

  return secDelay
  */

  const delay = clApi.requestRateLimitDelay({
    resourceType: 'cleanups',
    securityDelay: SECURITY_DELAY,
    minimumDelay: MIN_DELAY,
    parallelRequests
  })

  return delay

}


export default class CleanupsCreate extends Command {

  static description = 'create a new cleanup'

  static aliases = ['clp:create', 'cleanup']

  static examples = [
    '$ commercelayer cleanups:create -t skus',
    '$ cl clp:create -t stock_items',
  ]

  static flags = {
    type: Flags.string({
      char: 't',
      description: 'the type of resource to clean up',
      required: true,
      options: clConfig.cleanups.types as string[],
      helpValue: clConfig.cleanups.types.slice(0, 4).join('|') + '|...',
      multiple: false,
    }),
    where: Flags.string({
      char: 'w',
      multiple: true,
      description: 'comma separated list of query filters',
    }),
    notify: Flags.boolean({
      char: 'N',
      description: 'force system notification when cleanup has finished',
      hidden: true,
    }),
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

    const { flags } = await this.parse(CleanupsCreate)

    // Check application kind
    this.checkApplication(flags.accessToken, ['integration', 'cli'])

    this.cl = this.commercelayerInit(flags)

    // Check access to API before executing the command
    await this.checkAccessToken()


    try {

      const type = flags.type
      if (!clConfig.cleanups.types.includes(type)) this.error(`Unsupported resource type: ${clColor.style.error(type)}`)

      const monitor = !flags.blind

      // Where flags
      const wheres = this.whereFlag(flags.where)

      const resSdk: any = this.cl[type as keyof CommerceLayerClient]
      const clp = await resSdk.list({ filters: wheres, pageSize: clConfig.api.page_max_size })
      const cleanupsLength = clp.meta.recordCount

      // Check cleanup size
      const humanized = type.replace(/_/g, ' ')
      if (cleanupsLength === 0) this.error(`No ${clColor.cli.value(humanized)} to cleanup`)
      else {
        if ((MAX_RECORDS > 0) && (cleanupsLength > MAX_RECORDS)) this.error(`You are trying to cleanup ${clColor.yellowBright(cleanupsLength)} ${humanized}. Using the CLI you can cleanup up to ${MAX_RECORDS} items at a time`, {
          suggestions: [`Add more filter to reduce the number of records to cleanup to a number minor than ${MAX_RECORDS}`],
        })
      }

      // Split input
      const chunks: Chunk[] = await splitRecords(resSdk, {
        resource_type: type,
        filters: wheres
      })

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
          const msg1 = `You are trying to cleanup ${clColor.yellowBright(String(cleanupsLength))} ${resource}, more than the maximun ${clConfig.cleanups.max_size} elements allowed for each single cleanup.`
          const msg2 = `The cleanup will be split into a set of ${clColor.yellowBright(String(chunks.length))} distinct chunks with the same unique group ID ${clColor.underline.yellowBright(groupId)}.`
          const msg3 = `Execute the command ${clColor.cli.command(`cleanups:group ${groupId}`)} to retrieve all the related cleanups`
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

        this.log(`\nCleanup of ${clColor.yellowBright(String(cleanupsLength))} ${humanized} completed${withErrors ? ' with errors' : ''}.`)
      } else {
        await this.parallelizeImports(chunks, monitor)
        this.log(`\nThe cleanup of ${clColor.yellowBright(String(cleanupsLength))} ${resource} has been started`)
      }

      this.log()


    } catch (error: any) {
      this.handleError(error, flags)
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

    const cleanups: Array<Promise<Cleanup>> = []

    this.completed = 0
    for (const chunk of chunks) {
      const clp = this.createParallelCleanup(chunk, monitor)
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      if (clp) cleanups.push(clp)
    }

    if (monitor && this.monitor) {
      const results = await Promise.allSettled(cleanups)
      this.monitor.stop()
      return !results.some((r: any) => ((r.value === undefined) || (r.value.status === 'interrupted') || (r.value.errors_count > 0)))
    }

    return true

  }


  private async createCleanup(chunk: Chunk): Promise<Cleanup> {
    return this.cl.cleanups.create({
      resource_type: chunk.resource_type,
      filters: chunk.filters,
      reference: `${chunk.group_id}-${String(chunk.chunk_number).padStart(4, '0')}`,
      reference_origin: 'cli-plugin-cleanups',
      metadata: {
        chunk_number: `${chunk.chunk_number}/${chunk.total_chunks}`,
        chunk_items: `${chunk.start_item}-${chunk.end_item}`,
        group_id: chunk.group_id,
      },
    })
  }


  private async createParallelCleanup(chunk: Chunk, monitor?: boolean): Promise<Cleanup> {

    let bar: SingleBar

    if (monitor && this.monitor) bar = this.monitor.createBar(chunk)

    return this.createCleanup(chunk).then(async c => {

      let clp: Cleanup = c

      if (monitor && this.monitor) {

        let barValue = 0
        if (bar) barValue = this.monitor.updateBar(bar, 0, { cleanupId: c.id, status: 'waiting...' })

        do {

          await clUtil.sleep(requestDelay(chunk.total_batch_chunks - this.completed))
          const tmp = await this.cl.cleanups.retrieve(clp.id).catch(async error => {
            if (this.cl.isApiError(error) && (error.status === 429)) {
              if (clp?.status) barValue = this.monitor.updateBar(bar, barValue, { status: clColor.cyanBright(clp.status) })
              await clUtil.sleep(ERROR_429_DELAY)
            }
          })

          if (tmp) {
            clp = tmp
            if (bar) barValue = this.monitor.updateBar(bar, undefined, {
              processed: Number(clp.processed_count),
              errors: Number(clp.errors_count),
              status: clp.status,
            })
          }

        }
        while (!['completed', 'interrupted'].includes(clp.status || ''))

        this.completed++

      }


      return clp

      // eslint-disable-next-line @typescript-eslint/promise-function-async
    }).catch(error => {
      this.monitor.updateBar(bar, undefined, { message: this.monitor.message(/* error.message || */'Error', 'error') })
      return Promise.reject(error)
    })

  }

}
