import { Flags } from '@oclif/core'
import { BaseResourceCommand } from '../../base'
import type { MetricsOperation, MetricsQuery, MetricsQuerySearch, MetricsResource, MetricsSort } from '../../common'
import { sorts } from '../../common'
import { clColor } from '@commercelayer/cli-core'
import { metricsRequest } from '../../request'


export default class MetricsSearch extends BaseResourceCommand {

  static operation: MetricsOperation = 'search'

  static aliases = [MetricsSearch.operation]

  static override description = 'perform a search query on the Metrics API endpoint'

  static override examples = [
    'commercelayewr metrics:search orders -l 5 -s asc -b order.placed_at -f order.id,order.number,order.placed_at,customer.email'
  ]

  static override flags = {
    limit: Flags.integer({
      char: 'l',
      description: 'the maximum number of records shown in the response',
      min: 1,
      max: 100
    }),
    sort: Flags.string({
      char: 's',
      description: 'the way you want the results of the query to be sorted',
      options: sorts,
      dependsOn: ['sort_by']
    }),
    sort_by: Flags.string({
      char: 'b',
      description: 'the date field you want the results of the query sorted by'
    }),
    fields: Flags.string({
      char: 'f',
      description: 'comma-separated list of fields you want to be returned for each record in the response',
      required: true,
      multiple: true
    }),
    cursor: Flags.string({
      char: 'c',
      description: 'the cursor pointing to a specific page in the paginated search results'
    })
  }

  static override args = {
    ...BaseResourceCommand.args
  }


  public async run(): Promise<void> {

    const { args, flags } = await this.parse(MetricsSearch)

    this.checkAcessTokenData(flags.accessToken, flags)

    const resource = args.resource as MetricsResource
    const fields = this.multivalFlag(flags.fields)

    const querySearch: MetricsQuerySearch = {
      fields,
      limit: flags.limit,
      sort: flags.sort as MetricsSort,
      sort_by: flags.sort_by,
      cursor: flags.cursor
    }

    const filterObject = this.filterFlag(flags.filter)

    const query: MetricsQuery = {
      search: querySearch,
      filter: filterObject
    }

    const response = await metricsRequest(MetricsSearch.operation, query, resource, flags)
    const res = response.clone()
    await this.printResponse(response)

    // Print pagination info
    if (res.ok) {
      const pagination = (await res.json()).meta.pagination
      this.log(`Record count: ${clColor.yellowBright(pagination.record_count)}`)
      if (pagination.cursor) this.log(`Cursor: ${clColor.cyanBright(pagination.cursor)}`)
      this.log()
    }

  }

}
