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



const importsDelay = (totalItems: number): number => {
  return Math.ceil(((totalItems * apiConf.requests_max_secs) / apiConf.requests_max_num) * 1000)
}


export default class ImportsCreate extends Command {

  static description = 'create a new import'

  static aliases: ['imp:create']

  static examples = [
    '$ commercelayer imports:create -r stock_items -p <stock_location-id>',
    '$ cl imp:create skus -c',
  ]

  static flags = {
    ...Command.flags,
    resource: flags.string({
      char: 'r',
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
      description: 'the path of the file containing teh resource data to import in CSV format',
      required: true,
    }),
    json: flags.boolean({
      char: 'j',
      description: 'accept input file in JSON format',
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

      const resource = flags.resource
      const parentId = flags.parent
      const cleanup = flags.cleanup || false
      const inputFile = this.specialFolder(flags.inputs)

      const monitor = true


      const inputs: Array<any> = await generateInputs(inputFile, flags).catch(error => this.error(error.message))
      const inputsLength = inputs.length

      const chunks: Array<Chunk> = splitImports({
        resource_type: resource,
        parent_resource_id: parentId,
        cleanup_records: cleanup,
        inputs,
      })

      if (monitor) this.monitor = Monitor.create(inputsLength, this.log)

      const imports: Array<Promise<Import>> = []

      for (const chunk of chunks) {
        const imp = this.createImport(chunk, monitor)
        if (imp) imports.push(imp)
      }

      await Promise.allSettled(imports)

      if (monitor && this.monitor) {
        this.monitor.stop()
        this.log()
      }

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
          if (bar) this.monitor.updateBar(bar, 0, { importId: i.id, message: 'Waiting ...' })
          do {

            await sleep(Math.max(1000, importsDelay(chunk.total_chunks)))
            const tmp = await this.cl.imports.retrieve(imp.id).catch(() => undefined)

            if (tmp) {
              imp = tmp
              if (bar) this.monitor.updateBar(bar, undefined, {
                processed: Number(imp.processed_count),
                warnings: Number(imp.warnings_count),
                errors: Number(imp.errors_count),
              })
            }

          }
          while (imp.status !== 'completed')
        }

        return imp

      })
      .catch(error => {
        this.monitor.updateBar(bar, undefined, { message: this.monitor.message(error.message || 'Error', 'error') })
        return Promise.reject(error)
      })

  }

}
