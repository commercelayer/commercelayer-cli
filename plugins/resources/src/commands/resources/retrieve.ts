import Command, { flags } from '../../base'
import chalk from 'chalk'
import { baseURL } from '../../common'
import cl, { CLayer } from '@commercelayer/js-sdk'
import { inspect } from 'util'


export default class ResourcesRetrieve extends Command {

  static description = 'describe the command here'

  static aliases = ['retrieve', 'rr']

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
    { name: 'resource', description: 'the resource type', required: true },
    { name: 'id', description: 'id of the resource to retrieve', required: false },
  ]

  async run() {

    const {args, flags} = this.parse(ResourcesRetrieve)

    let res = args.resource
    let id = args.id

    const si = res.indexOf('/')
    if (si >= 0) {
      const rt = res.split('/')
      res = rt[0]
      if (id && rt[1]) this.error(`Double definition of resource id: [${rt[1]}, ${id}]`, {
        suggestions: [`Define resource id as command argument (${chalk.italic(id)}) or as part of the resource itself (${chalk.italic(`${res}/${rt[1]}`)}) but not both`],
      })
      else id = rt[1]
    }

    if (!res) this.error('Resource type not defined')
    if (!id) this.error('Resource id not defined')

    const resource = this.checkResource(res)

    const baseUrl = baseURL(flags.organization, flags.domain)
    const accessToken = flags.accessToken

    // this.log('baseUrl: ' + baseUrl)
    // this.log('accessToken: ' + accessToken)

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

      const r = await req.find(id, { rawResponse: true })

      if (r) this.log(flags.json ? JSON.stringify(r, null, 4) : inspect(r, false, null, true))

    } catch (error) {
      if (error.response.status === 401) this.error(chalk.bgRed(`${error.response.statusText} [${error.response.status}]`),
        { suggestions: ['Execute login to get access to the selected resource'] }
      )
      else this.error(inspect(error.response.data.errors, false, null, true))
    }

  }

}
