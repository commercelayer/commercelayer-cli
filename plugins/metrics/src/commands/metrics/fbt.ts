import { Flags } from '@oclif/core'
import { BaseCommand, BaseFilterCommand } from '../../base'
import { metricsRequest } from '../../request'
import type { MetricsQueryFbt } from '../../common'
import { clColor } from '@commercelayer/cli-core'
import * as cliux from '@commercelayer/cli-ux'


export default class MetricsFbt extends BaseFilterCommand {

  static operation = 'fbt'

  static aliases = [MetricsFbt.operation]

  static override description = 'perform a Frequently Bought Together query on the Metrics API analysis endpoint'

  static override examples = [
    'commercelayer metrics:fbt --in xYZkjABcde,yzXKjYzaCx'
  ]

  static override flags = {
    in: Flags.string({
      char: 'i',
      description: 'a list of SKU or bundle IDs associated as line items to one or more orders',
      required: false,
      multiple: true,
      relationships: [
        { type: 'some', flags: ['in', 'filter'] }
      ],
    })
  }


  public async run(): Promise<void> {

    const { flags } = await this.parse(MetricsFbt)

    this.checkAcessTokenData(flags.accessToken, flags)

    const ids = this.multivalFlag(flags.in)
    const filterObject = this.filterFlag(flags.filter)

    const query: MetricsQueryFbt = (ids.length > 0) ? {
      filter: {
        ...filterObject,
        line_items: {
          item_ids: {
            in: ids
          }
        }
      }
    } : {}

    const response = await metricsRequest(MetricsFbt.operation, query, undefined, flags)

    if (response.ok) {
      cliux.action.stop(clColor.msg.success('Done'))
      const jsonRes = await response.json()
      const data = jsonRes.data
      if (data?.length > 0) this.log(String(data))
      else this.log(clColor.dim(String('\nNo data found for the given SKU or bundle IDs\n')))
    }
    else await this.printResponse(response)

  }

}
