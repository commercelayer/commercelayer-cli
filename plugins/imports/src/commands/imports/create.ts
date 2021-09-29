/* eslint-disable no-await-in-loop */
import Command, { flags } from '../../base'
import CommerceLayer, { CommerceLayerClient } from '@commercelayer/sdk'
import { generateInputs } from '../../input'
import { SingleBar } from 'cli-progress'
import { Import } from '@commercelayer/sdk/lib/resources/imports'
import { sleep } from '../../common'
import { Monitor } from '../../monitor'
import { Chunk, splitImports } from '../../chunk'
import apiConf from '../../api-conf'
import chalk from 'chalk'


const MIN_DELAY = 1000
const SECURITY_DELAY = 50

const importsDelay = (parallelRequests: number): number => {

  const unitDelayBurst = apiConf.requests_max_secs_burst / apiConf.requests_max_num_burst
  const unitDelayAvg = apiConf.requests_max_secs_avg / apiConf.requests_max_num_avg

  const delayBurst = parallelRequests * unitDelayBurst
  const delayAvg = parallelRequests * unitDelayAvg

  const delay = Math.ceil(Math.max(delayBurst, delayAvg) * 1000)

  return Math.max(MIN_DELAY, delay + SECURITY_DELAY)

}


export default class ImportsCreate extends Command {

  static description = 'create a new import'

  static aliases: ['imp:create']

  static examples = [
    '$ commercelayer imports:create -t stock_items -p <stock_location-id> -i <input-file-path>',
    '$ cl imp:create skus -c -i <input-file-path>',
  ]

  static flags = {
    ...Command.flags,
    type: flags.string({
      char: 't',
      description: 'the type of resource being imported',
      required: true,
      options: apiConf.imports_types,
    }),
    parent: flags.string({
      char: 'p',
      description: 'the id of the parent resource to be associated with imported data',
    }),
    cleanup: flags.boolean({
      char: 'c',
      description: 'delete all other existing items',
    }),
    inputs: flags.string({
      char: 'i',
      description: 'the path of the file containing the data to import',
      required: true,
    }),
    csv: flags.boolean({
      char: 'C',
      description: 'accept input file in CSV format',
      dependsOn: ['inputs'],
    }),
    blind: flags.boolean({
      char: 'b',
      description: 'execute in blind mode without showing the progress monitor',
    }),
  }


  cl!: CommerceLayerClient

  monitor!: Monitor


  async run() {

    const { flags } = this.parse(ImportsCreate)

    const organization = flags.organization
    const accessToken = flags.accessToken
    const domain = flags.domain


    // eslint-disable-next-line new-cap
    this.cl = CommerceLayer({
      organization,
      domain,
      accessToken,
    })


    // Check access to API before executing the command
    await this.checkAccessToken()


    try {

      const type = flags.type
      const parentId = flags.parent
      const cleanup = flags.cleanup || false
      const inputFile = this.specialFolder(flags.inputs)

      const monitor = !flags.blind

      const inputs: Array<any> = await generateInputs(inputFile, flags).catch(error => this.error(error.message))
      const inputsLength = inputs.length

      if (inputsLength === 0) this.error(`No ${type.replaceAll(/_/, ' ')} to import`)

      const chunks: Array<Chunk> = splitImports({
        resource_type: type,
        parent_resource_id: parentId,
        cleanup_records: cleanup,
        inputs,
      })

      const groupId = chunks[0]?.group_id
      const resource = type.replace(/_/g, ' ')

      if (chunks.length > 1) {
        this.log()
        const msg1 = `The input file contains ${chalk.yellowBright(String(inputsLength))} ${resource}, more than the maximun ${apiConf.imports_max_size} elements allowed for each single import.`
        const msg2 = `The import will be split into a set of ${chalk.yellowBright(String(chunks.length))} distinct chunks with the same unique group ID ${chalk.underline.yellowBright(groupId)}.`
        const msg3 = `Execute the command ${chalk.italic(`imports:group ${groupId}`)} to retrieve all the related imports`
        this.log(`${msg1} ${msg2} ${msg3}`)
      }

      if (monitor) this.monitor = Monitor.create(inputsLength, this.log)
      else this.log(`\nThe import of ${chalk.yellowBright(String(inputsLength))} ${resource} has been started`)

      const imports: Array<Promise<Import>> = []

      for (const chunk of chunks) {
        const imp = this.createImport(chunk, monitor)
        if (imp) imports.push(imp)
      }

      if (monitor && this.monitor) {
        await Promise.allSettled(imports)
        this.monitor.stop()
      }

      this.log()


    } catch (error) {
      this.printError(error)

    }

  }


  private async checkAccessToken() {
    try {
      await this.cl.application.retrieve()
    } catch (error) {
      if (this.cl.isApiError(error) && error.status && (error.status >= 400)) {
        const err = error.errors[0]
        this.error(`${err.title}: ${err.detail}`)
      }
    }
  }


  async createImport(chunk: Chunk, monitor?: boolean): Promise<Import> {

    let bar: SingleBar

    if (monitor && this.monitor) bar = this.monitor.createBar(chunk)

    return this.cl.imports.create({
      resource_type: chunk.resource_type,
      parent_resource_id: chunk.parent_resource_id,
      cleanup_records: chunk.cleanup_records,
      inputs: chunk.inputs,
      reference: `${chunk.group_id}-${String(chunk.chunk_number).padStart(4, '0')}`,
      reference_origin: 'cli-plugin-imports',
      metadata: {
        chunk_number: `${chunk.chunk_number}/${chunk.total_chunks}`,
        chunk_items: `${chunk.start_item}-${chunk.end_item}`,
        group_id: chunk.group_id,
      },
    })
      .then(async i => {

        let imp: Import = i

        if (monitor && this.monitor) {
          let barValue = 0
          if (bar) barValue = this.monitor.updateBar(bar, 0, { importId: i.id, status: 'waiting...' })
          do {

            await sleep(importsDelay(chunk.total_chunks))
            const tmp = await this.cl.imports.retrieve(imp.id)
              .catch(async err => {
                if (this.cl.isApiError(err) && (err.status === 429)) {
                  if (imp && imp.status) barValue = this.monitor.updateBar(bar, barValue, { status: chalk.cyanBright(imp.status) })
                  await sleep(10000)
                }
              })

            if (tmp) {
              imp = tmp
              if (bar) barValue = this.monitor.updateBar(bar, undefined, {
                processed: Number(imp.processed_count),
                warnings: Number(imp.warnings_count),
                errors: Number(imp.errors_count),
                status: imp.status,
              })
            }

          }
          while (!['completed', 'interrupted'].includes(imp.status || ''))
        }

        return imp

      })
      .catch(error => {
        this.monitor.updateBar(bar, undefined, { message: this.monitor.message(/* error.message || */'Error', 'error') })
        return Promise.reject(error)
      })

  }

}
