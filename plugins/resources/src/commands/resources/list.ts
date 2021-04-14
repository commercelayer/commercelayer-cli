import Command, { flags } from '../../base'
import { baseURL } from '../../common'
import cl, { CLayer } from '@commercelayer/js-sdk'

export default class ResourcesList extends Command {

  static description = 'fetch a collection of resources'

  static aliases = ['list', 'rl', 'res:list']

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
    where: flags.string({
      char: 'w',
      multiple: true,
      description: 'comma separated list of query filters',
    }),
    page: flags.integer({
      char: 'p',
      description: 'page number',
    }),
    pageSize: flags.integer({
      char: 'n',
      description: 'number of elements per page',
    }),
    sort: flags.string({
      char: 's',
      description: 'defines results ordering',
      multiple: true,
    }),
  }

  static args = [
    ...Command.args,
  ]

  async run() {

    const { args, flags } = this.parse(ResourcesList)

    const resource = this.checkResource(args.resource)

    const baseUrl = baseURL(flags.organization, flags.domain)
    const accessToken = flags.accessToken

    // Include flags
    const include: string[] = this.includeValuesArray(flags.include)
    // Fields flags
    const fields = this.mapToSdkParam(this.fieldsValuesMap(flags.fields))
    // Where flags
    const wheres = this.mapToSdkParam(this.whereValuesMap(flags.where))
    // Order flags
    const order = this.mapToSdkParam(this.orderingValuesMap(flags.sort))

    const page = flags.page
    const perPage = flags.pageSize


    cl.init({ accessToken, endpoint: baseUrl })

    try {

      const resObj: any = (cl as CLayer)[resource.sdk as keyof CLayer]
      let req = resObj

      if (include && (include.length > 0)) req = req.includes(...include)
      if (fields && (fields.length > 0)) req = req.select(...fields)
      if (wheres && (wheres.length > 0)) req = req.where(...wheres)
      if (order && (order.length > 0)) req = req.order(...order)
      if (perPage && (perPage > 0)) req = req.perPage(perPage)
      if (page && (page > 0)) req = req.page(page)

      const res = await req.all({ rawResponse: true })

      this.printOutput(res, flags)

      return res

    } catch (error) {
      this.printError(error)
    }

    /*
    console.log('INCLUDE'); console.log(include)
    console.log('SELECT'); console.log(fields)
    console.log('WHERE'); console.log(wheres)
    console.log('ORDER'); console.log(order)
    console.log('PAGE'); console.log(page)
    console.log('PER-PAGE'); console.log(perPage)
    */

  }

}
