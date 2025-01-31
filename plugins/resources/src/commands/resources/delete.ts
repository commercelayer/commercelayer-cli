import Command, { Args, FLAG_LOAD_PARAMS, FLAG_SAVE_PARAMS } from '../../base'
import { type CommerceLayerClient } from '@commercelayer/sdk'
import { addRequestReader, isRequestInterrupted } from '../../lang'
import { clCommand, clColor, clConfig, clApi } from '@commercelayer/cli-core'



const OPERATION = 'delete'

const OPERATION_LIMIT = (clConfig.api.requests_max_num_burst_test - 5)


export default class ResourcesDelete extends Command {

  static description = 'delete an existing resource'

  static aliases = [OPERATION, 'rd', 'res:delete']

  static examples = [
    '$ commercelayer resources:delete customers/<customerId>',
    '$ cl delete customers <customerId>'
  ]

  static flags = {
    ...(clCommand.commandFlags(Command.flags, [FLAG_SAVE_PARAMS, FLAG_LOAD_PARAMS, 'fields', 'include', 'json', 'unformatted']))
  }

  static args = {
    ...Command.args,
    id: Args.string({ name: 'id', description: `id of the resources to delete (max ${OPERATION_LIMIT})`, required: false })
  }


  async run(): Promise<any> {

    const { args, flags } = await this.parse(ResourcesDelete)

    /*
    const invalidFlags: string[] = ['fields', 'include']
    invalidFlags.forEach(x => {
      if (flags[x as keyof typeof flags]) this.error(`Flag not supported in ${clColor.cli.command(OPERATION)} operation: ${clColor.style.error(x)}`)
    })
      */


    const resId = this.checkResourceId(args.resource, args.id)
    const resource = this.checkResource(resId.res, { singular: ((resId.id !== undefined) && !resId.id.includes(',')) })
    const id = this.checkLastId(flags.organization, resource.api, resId.id)

    const showHeaders = flags.headers || flags['headers-only']

    const idList = id? id.split(',') : []
    const multiDelete = (idList.length > 1)
    if (multiDelete) {
      if (showHeaders) this.error(`Flags ${clColor.style.error('--headers')} and $${clColor.style.error('--headers-only')} not supported in multi delete operation`)
      if (idList.length > OPERATION_LIMIT) this.error(`Max number of resources to delete in a single operation is ${clColor.yellowBright(OPERATION_LIMIT)}`)
    }


    const cl = this.initCommerceLayer(flags)

    const rawReader = (!multiDelete && flags.raw && showHeaders) ? cl.addRawResponseReader({ headers: showHeaders }) : undefined
    const reqReader = flags.doc ? addRequestReader(cl) : undefined

    try {

      const resSdk: any = cl[resource.api as keyof CommerceLayerClient]
      this.checkOperation(resSdk, OPERATION)

      if (multiDelete) await this.multiDeleteOperation(resSdk, idList, resource.type)
      else {
        await resSdk.delete(resource.singleton? undefined : id)
        if (showHeaders) this.printHeaders(rawReader?.headers, flags)
        this.log(`\n${clColor.style.success('Successfully')} deleted resource of type ${clColor.style.resource(resource.api)}${resource.singleton? '' : ` with id ${clColor.style.id(id)}`}\n`)
      }

    } catch (error) {
      if (isRequestInterrupted(error) && reqReader) {
        await this.showLiveDocumentation(reqReader.request, undefined, flags)
        cl.removeInterceptor('request', reqReader.id)
      } else this.printError(error, flags, args)
    }

  }


  private async multiDeleteOperation(resSdk: any, idList: string[], type: string): Promise<void> {

    const errors: Record<string, Error> = {}

    const deletes: Array<Promise<any>> = idList.map(id => resSdk.delete(id).catch((err: Error) => {
      errors[id] = err
      throw err
    }))
    const results = await Promise.allSettled(deletes)

    const oks: string[] = []
    const kos: string[] = []

    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      if (result.status === 'fulfilled') oks.push(idList[i])
      else kos.push(idList[i])
    }

    const humanized = clApi.humanizeResource(type)

    this.log()
    if (kos.length === 0) this.log(`All ${idList.length} ${clColor.style.resource(humanized)} have been ${clColor.style.success('successfully')} deleted`)
      else
    if (oks.length === 0) this.log(`${clColor.style.error('Failed')} to delete all ${clColor.style.resource(humanized)}`)
    else {
      this.log(`${clColor.style.success('Successfully')} deleted ${clColor.style.resource(humanized)} with id: ${oks.join(', ')}`)
      this.log()
      this.log(`${clColor.style.error('Failed')} to delete the following ${clColor.style.resource(humanized)}:`)
    }
    this.log()

    if ((Object.keys(errors).length > 0) && (kos.length > 0)) {
      Object.entries(errors).forEach(([id, err]) => { this.log(`- ${clColor.style.id(id)}: ${clColor.italic(err.message)}`) })
      this.log()
    }

  }

}
