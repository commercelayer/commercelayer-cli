import { clColor } from '@commercelayer/cli-core'
import { BaseBreakdownCommand, BaseResourceCommand, Flags } from '../../base'
import type { MetricsCondition, MetricsOperation, MetricsOperator, MetricsQuery, MetricsQueryBreakdown, MetricsResource, MetricsSort } from '../../common'
import { conditions, sorts } from '../../common'
import { metricsRequest } from '../../request'
import * as cliux from '@commercelayer/cli-ux'


export default class MetricsBreakdown extends BaseBreakdownCommand {

  static operation: MetricsOperation = 'breakdown'

  static aliases = ['metrics:break', MetricsBreakdown.operation]

  static override description = 'perform a breakdown query on the Metrics API endpoint'

  static override examples = [
    'commercelayer metrics:breakdown orders -b order.country_code -f order.id -O value_count -s desc -l 20',
    'cl breakdown orders -b order.country_code -f order.id -O value_count -s desc -l 20 -B \'{"by": "line_items.name","field": "line_items.id","operator": "value_count","sort": "desc","limit": 20}\'',
  ]

  static override flags = {
    condition: Flags.string({
      char: 'c',
      summary: 'an additional constraint to fine-tune the set of records',
      description: 'the condition is applied to the computed results of the query and it is available for operators that return single numeric (float or integer) values.'
    }),
    sort: Flags.string({
      char: 's',
      description: 'the way you want the results of the query to be sorted',
      options: sorts
    }),
    limit: Flags.integer({
      char: 'l',
      description: 'the maximum number of records shown in the response',
      min: 1,
      max: 100
    })
  }

  static override args = {
    ...BaseResourceCommand.args
  }


  public async run(): Promise<void> {

    const { args, flags } = await this.parse(MetricsBreakdown)

    this.checkAcessTokenData(flags.accessToken, flags)

    const resource = args.resource as MetricsResource

    const operator = flags.operator as MetricsOperator
    const condition = this.conditionFlag(flags.condition)
    const sort = flags.sort as MetricsSort
    const breakdown = this.breakdownFlag(flags.breakdown)

    const queryBreakdown: MetricsQueryBreakdown = {
      by: flags.by,
      field: flags.field,
      operator,
      condition,
      sort,
      limit: flags.limit,
      breakdown
    }

    const filterObject = this.filterFlag(flags.filter)

    const query: MetricsQuery = {
      breakdown: queryBreakdown,
      filter: filterObject
    }

    const response = await metricsRequest(MetricsBreakdown.operation, query, resource, flags)

    if (response.ok) {
      const breakdown0 = (await response.json()).data
      cliux.action.stop(clColor.msg.success('Done'))
      this.log()
      this.printBreakdown(flags.by, breakdown0)
      this.log()
    }
    else await this.printResponse(response)

  }



  protected conditionFlag(flag?: string): MetricsCondition | undefined {

    let condition: MetricsCondition | undefined

    if (flag) {

      const eqi = flag.indexOf('=')
      if (eqi < 1) this.error(`Invalid condition flag: ${clColor.msg.error(flag)}`, {
        suggestions: [`Condition flag must be defined using the format ${clColor.cli.value('name=value')}`]
      })

      // Condition name and value
      const name = flag.substring(0, eqi)

      if (!conditions.includes(name)) this.error(`Invalid condition name: ${clColor.msg.error(name)}`, {
        suggestions: [`Condition name must be one of the following: ${clColor.cli.value(conditions.join(', '))}`]
      })
      const value = flag.substring(eqi + 1, flag.length)

      const usi = name.indexOf('_')
      if (usi > 0) {  // interval condition
        const values = value.split(',')
        if (values.length !== 2) this.error(`Invalid condition value: ${clColor.msg.error(value)}`, {
          suggestions: [`Interval condition flag must be defined using the format ${clColor.cli.value('name=from,to')}`]
        })
        const from = values[0]
        const to = values[1]
        condition = { [name]: [from, to] }
      } else condition = { [name]: value }

    }

    return condition

  }

}
