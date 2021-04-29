import Command, { flags } from '../../base'
import { baseURL } from '../../common'
import cl, { CLayer } from '@commercelayer/js-sdk'
import { denormalize } from '../../jsonapi'


export default class ResourcesRetrieve extends Command {

  static description = 'fetch a single resource'

  static aliases = ['retrieve', 'rr', 'res:retrieve']

  static examples = [
    '$ commercelayer resources:retrieve customers/<customerId>',
    '$ commercelayer retrieve customers <customerId>',
    '$ cl res:retrieve customers <customerId>',
    '$ clayer rr customers/<customerId>',
  ]

  static flags = {
    ...Command.flags,
    include: flags.string({
      char: 'i',
      multiple: true,
      description: 'comma separated resources to include',
    }),
    fields: flags.string({
      char: 'f',
      multiple: true,
      description: 'comma separeted list of fields in the format [resource]=field1,field2...',
    }),
    save: flags.string({
      char: 'x',
      description: 'save command output to file',
      multiple: false,
      exclusive: ['save-path'],
    }),
    'save-path': flags.string({
      char: 'X',
      description: 'save command output to file and create missing path directories',
      multiple: false,
      exclusive: ['save'],
    }),
  }

  static args = [
    ...Command.args,
    { name: 'id', description: 'id of the resource to retrieve', required: false },
  ]

  async run() {

    const { args, flags } = this.parse(ResourcesRetrieve)

    const { res, id } = this.checkResourceId(args.resource, args.id)

    const resource = this.checkResource(res, { singular: true })

    const baseUrl = baseURL(flags.organization, flags.domain)
    const accessToken = flags.accessToken

    // Include flags
    const include: string[] = this.includeValuesArray(flags.include)
    // Fields flags
    const fields = this.mapToSdkParam(this.fieldsValuesMap(flags.fields))


    cl.init({ accessToken, endpoint: baseUrl })

    try {

      const resObj: any = (cl as CLayer)[resource.sdk as keyof CLayer]
      let req = resObj

      if (include && (include.length > 0)) req = req.includes(...include)
      if (fields && (fields.length > 0)) req = req.select(...fields)

      const res = await req.find(id, { rawResponse: true })

      const out = flags.raw ? res : denormalize(res)

      this.printOutput(out, flags)

      if (flags.save || flags['save-path']) this.saveOutput(out, flags)


      return out

    } catch (error) {
      this.printError(error)
    }

  }

}
