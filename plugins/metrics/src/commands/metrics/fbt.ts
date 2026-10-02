import { clColor } from '@commercelayer/cli-core'
import * as cliux from '@commercelayer/cli-ux'
import { Flags } from '@oclif/core'
import { BaseCommand } from '../../base'
import type { MetricsFbtItem, MetricsQueryFbt } from '../../common'
import { metricsRequest } from '../../request'


export default class MetricsFbt extends BaseCommand {

  static operation = 'fbt'

  static aliases = [MetricsFbt.operation]

  static override description = 'perform a Frequently Bought Together query on the Metrics API analysis endpoint'

  static override examples = [
    'commercelayer metrics:fbt --in xYZkjABcde,yzXKjYzaCx'
  ]

  // The FBT query only takes the item IDs: the Metrics API refuses a query
  // without them (400) and documents no other filter
  static override flags = {
    in: Flags.string({
      char: 'i',
      description: 'a list of SKU or bundle IDs associated as line items to one or more orders (the orders must contain all of them)',
      required: true,
      multiple: true
    })
  }


  public async run(): Promise<void> {

    const { flags } = await this.parse(MetricsFbt)

    this.checkAcessTokenData(flags.accessToken, flags)

    const ids = this.multivalFlag(flags.in).filter(Boolean)
    if (ids.length === 0) this.error(`Specify at least one SKU or bundle ID with the ${clColor.cli.flag('--in')} flag`)

    const query: MetricsQueryFbt = {
      filter: {
        line_items: {
          item_ids: {
            in: ids
          }
        }
      }
    }

    const response = await metricsRequest(MetricsFbt.operation, query, undefined, flags)

    if (response.ok) {
      cliux.action.stop(clColor.msg.success('Done'))
      const jsonRes = await response.json()
      const data: MetricsFbtItem[] = jsonRes.data ?? []
      if (data.length > 0) this.printItems(data)
      else this.log(clColor.dim(String('\nNo data found for the given SKU or bundle IDs\n')))
    }
    else await this.printResponse(response)

  }


  /** One line per item, from the most frequently bought together: name (type ID): number of orders */
  private printItems(items: MetricsFbtItem[]): void {
    this.log()
    for (const item of items)
      this.log(`${clColor.cyanBright(item.name || item.item_id)} ${clColor.dim(`(${item.type} ${item.item_id})`)}: ${clColor.yellow(item.value)}`)
    this.log()
  }

}
