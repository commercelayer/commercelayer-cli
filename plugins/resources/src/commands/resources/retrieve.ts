import Command, { flags } from '../../base'
import { baseURL } from '../../common'
import cl, { CLayer } from '@commercelayer/js-sdk'


export default class ResourcesRetrieve extends Command {

  static description = 'fetch a single resource'

  static aliases = ['retrieve', 'rr', 'res:retrieve']

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
  }

  static args = [
    ...Command.args,
    { name: 'id', description: 'id of the resource to retrieve', required: false },
  ]

  async run() {

    const { args, flags } = this.parse(ResourcesRetrieve)

    const { res, id } = this.checkResourceId(args.resource, args.id)

    const resource = this.checkResource(res)

    const baseUrl = baseURL(flags.organization, flags.domain)
    const accessToken = flags.accessToken

    // Include flags
    const include: string[] = this.includeValuesArray(flags.include)
    // Fields flags
    const fields = this.mapToSdkParam(this.fieldsValuesMap(flags.fields))


    cl.init({ accessToken, endpoint: baseUrl })

    try {

      const resObj: any = (cl as CLayer)[resource?.sdk as keyof CLayer]
      let req = resObj

      if (include && (include.length > 0)) req = req.includes(...include)
      if (fields && (fields.length > 0)) req = req.select(...fields)

      const res = await req.find(id, { rawResponse: true })

      this.printOutput(res, flags)

      return res

    } catch (error) {
      this.printError(error)
    }

  }

}
