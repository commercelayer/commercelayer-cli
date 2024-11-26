import { type KeyValString, clColor, clApi, clUtil, clFilter } from '@commercelayer/cli-core'
import { CommerceLayer, type CommerceLayerClient, type ListResponse, type Resource } from '@commercelayer/sdk'
import { BaseCommand, Flags, Args, cliux } from '../../base'


export default class ResourcesCount extends BaseCommand {

  static description = 'count the number of existent resources'

  static aliases = ['count', 'res:count', 'rs:count']

  static examples = [
    'commercelayer resources:count customers',
    'cl count customers -w customer_group_name_eq=<customer-group-name>'
  ]

  static flags = {
    ...BaseCommand.flags,
    where: Flags.string({
      char: 'w',
      multiple: true,
      description: 'comma separated list of query filters'
    })
  }


  static args = {
    resource: Args.string({ name: 'resource', description: 'the resource type', required: true })
  }



  public async run(): Promise<void> {

    const { args, flags } = await this.parse(ResourcesCount)

    const resource = this.checkResource(args.resource)

    const organization = flags.organization
    const domain = flags.domain
    const accessToken = flags.accessToken


    const cl = CommerceLayer({ organization, domain, accessToken, userAgent: clUtil.userAgent(this.config) })
    const resSdk: any = cl[resource.api as keyof CommerceLayerClient]
    this.checkOperation(resSdk)


    const filters = this.whereFlag(flags.where)


    const humanized = clApi.humanizeResource(resource.type)

    this.log()
    if (!flags.doc) cliux.action.start(`Counting ${humanized}`)

    const res = await resSdk.list({ filters, pageNumber: 1, pageSize: 1 }) as ListResponse<Resource>

    if (res?.recordCount) cliux.action.stop(clColor.yellowBright(res.recordCount.toLocaleString()))
    else {
      cliux.action.stop(clColor.msg.error('error'))
      this.error(`\nError counting ${humanized}`)
    }

    this.log()

  }


  protected checkOperation(sdk: any): boolean {
    if (!sdk.count) this.error(`${clColor.msg.error('Count')} operation not supported for resource ${clColor.api.resource(sdk.type())}`)
    return true
  }


  whereFlag(flag: string[] | undefined): KeyValString {

    const wheres: KeyValString = {}

    if (flag && (flag.length > 0)) {
      flag.forEach(f => {

        const wt = f.split('=')
        if (wt.length < 2) this.error(`Filter flag must be in the form ${clColor.style.attribute('predicate=value')}`)
        const w = wt[0]
        if (!clFilter.available(w)) this.error(`Invalid query filter: ${clColor.style.error(w)}`, {
          suggestions: [`Execute command ${clColor.style.command('resources:filters')} to get a full list of all available filter predicates`],
          ref: 'https://docs.commercelayer.io/api/filtering-data#list-of-predicates',
        })

        const v = wt[1]

        wheres[w] = v

      })
    }

    return wheres

  }

}
