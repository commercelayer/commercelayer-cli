import { clColor, clOutput } from '@commercelayer/cli-core'
import { BaseBreakdownCommand, BaseResourceCommand, Flags } from '../../base'
import { intervals, MetricsInterval, MetricsOperator, MetricsQuery, MetricsQueryDateBreakdown, MetricsResource, operatorMap } from '../../common'
import { metricsRequest } from '../../request'
import * as cliux from '@commercelayer/cli-ux'


export default class MetricsDateBreakdown extends BaseBreakdownCommand {

  static operation = 'date_breakdown'

  static aliases = ['metrics:breakdate', 'metrics:date', 'breakdate', MetricsDateBreakdown.operation]

  static override description = 'perform a date breakdown query on the Metrics API endpoint'

  static override examples = [
    'commercelayer metrics:date_breakdown orders -b order.placed_at -f order.total_amount_with_taxes -O stats -i month'
  ]

  static override flags = {
    interval: Flags.string({
      char: 'i',
      description: 'the time interval over which the metrics are computed',
      options: intervals
    })
  }

  static override args = {
    ...BaseResourceCommand.args
  }


  public async run(): Promise<void> {

    const { args, flags } = await this.parse(MetricsDateBreakdown)

    this.checkAcessTokenData(flags.accessToken, flags)

    const resource = args.resource as MetricsResource

    const operator = flags.operator as MetricsOperator
    const interval = flags.interval as MetricsInterval
    const breakdown = this.breakdownFlag(flags.breakdown)

    const queryBreakdown: MetricsQueryDateBreakdown = {
      by: flags.by,
      field: flags.field,
      operator,
      interval,
      breakdown
    }

    const filterObject = this.filterFlag(flags.filter)

    const query: MetricsQuery = {
      date_breakdown: queryBreakdown,
      filter: filterObject
    }

    const response = await metricsRequest(MetricsDateBreakdown.operation, query, resource, flags)

    if (response.ok) {
      const dateBreakdown = (await response.json()).data
      cliux.action.stop(clColor.msg.success('Done'))
      this.log()
      this.printDateBreakdown(operator, dateBreakdown)
      this.log()
    }
    else await this.printResponse(response)

  }


  protected printDateBreakdown(operator: MetricsOperator, data: any, level: number = 0): void {

    if (level === 0) cliux.action.stop(clColor.msg.success('Done'))

    const operatorInfo = operatorMap[operator]

    this.log('----------------------------------------')
    for (const item of (data as any[])) {

      this.log(`date: ${clColor.magenta(clOutput.cleanDate(item.date))}`)

      if (operatorInfo.type === 'Object') {
        this.log(`${operator} = {`);
        ['count', 'min', 'max', 'avg', 'sum'].forEach((op) => {
          this.log(`  ${op.padStart(5, ' ')}: ${clColor.yellow(item.value[op])}`)
        })
        this.log('}')
      } else this.log(`${operator} = ${clColor.yellow(item.value)}`)

      const extraFields = Object.keys(item).filter((field: any) => !['label', 'value', 'date'].includes(field))
      const nestedBreakdown = (extraFields.length > 0) ? extraFields[0] : undefined
      if (nestedBreakdown) this.printBreakdown(nestedBreakdown, item, level)

      this.log('----------------------------------------')

    }

  }

}
