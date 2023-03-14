import { Command, Args } from '@oclif/core'
import { ConfigParams, configParam } from '../../config'
import { inspect } from 'util'
import { clColor } from '@commercelayer/cli-core'


export default class ConfigGet extends Command {

  static description = 'get a CLI configuration parameter'

  static hidden: true


  static args = {
    param: Args.string({ name: 'param', required: true, description: 'configuration parameter name' }),
  }


  async run(): Promise<any> {

    const { args } = await this.parse(ConfigGet)

    const param = args.param

    if (Object.keys(ConfigParams).includes(param)) {
      this.log(`\n${clColor.table.key(param)} = ${inspect(configParam(ConfigParams[param as keyof typeof ConfigParams]), false, null, true)}\n`)
    } else this.error(`Invalid configuration param: ${clColor.msg.error(param)}`)

  }

}
