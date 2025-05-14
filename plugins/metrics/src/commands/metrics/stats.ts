import { Flags } from '@oclif/core'
import { BaseResourceCommand } from '../../base'
import type { MetricsOperation, MetricsOperator, MetricsQuery, MetricsQueryStats, MetricsResource } from '../../common'
import { operatorMap, operators } from '../../common'
import * as cliux from '@commercelayer/cli-ux'
import { clColor } from '@commercelayer/cli-core'
import { metricsRequest } from '../../request'


export default class MetricsStats extends BaseResourceCommand {

  static operation: MetricsOperation = 'stats'

  static aliases = [MetricsStats.operation]

  static override description = 'perform a stats query on the Metrics API endpoint'

  static override examples = [
    'commercelayer metrics:stats orders -f order.total_amount_with_taxes --op avg',
    'cl stats orders -f order.total_amount_with_taxes -O stats'
  ]

  static override flags = {
    field: Flags.string({
      char: 'f',
      description: 'the field you want the metrics or statistics computed on',
      required: true
    }),
    operator: Flags.string({
      char: 'O',
      aliases: ['op'],
      description: 'the computing operator',
      options: operators,
      required: true
    }),
    description: Flags.boolean({
      char: 'D',
      description: 'show the description of the operator used for the query',
      hidden: true
    }),
  }

  static override args = {
    ...BaseResourceCommand.args
  }


  public async run(): Promise<void> {

    const { args, flags } = await this.parse(MetricsStats)

    this.checkAcessTokenData(flags.accessToken, flags)

    const resource = args.resource as MetricsResource

    const field = flags.field
    const operator = flags.operator as MetricsOperator

    const queryStats: MetricsQueryStats = {
      field,
      operator
    }

    const filterObject = this.filterFlag(flags.filter)

    const query: MetricsQuery = {
      stats: queryStats,
      filter: filterObject
    }

    const response = await metricsRequest(MetricsStats.operation, query, resource, flags)

    if (response.ok) {

      cliux.action.stop(clColor.msg.success('Done'))

      const operatorInfo = operatorMap[operator]

      if (flags.description) this.log(clColor.italic(`\n${operatorInfo.description}`))

      const func = `${clColor.cyan(`${operator}(`)}${clColor.italic(field)}${clColor.cyan(')')}`
      const jsonRes = await response.json()
      const value = jsonRes.data.value

      this.log()
      if (operatorInfo.type === 'Object') {
        this.log(`${func} = {`);
        ['count', 'min', 'max', 'avg', 'sum'].forEach((op) => {
          this.log(`  ${op.padStart(5, ' ')}: ${clColor.yellow(value[op])}`)
        })
        this.log('}')
      } else this.log(`${func} = ${clColor.yellow(value)}`)
      this.log()

    } else await this.printResponse(response)

  }

}
