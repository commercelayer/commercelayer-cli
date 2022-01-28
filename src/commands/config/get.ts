import { Command } from '@oclif/core'
import { ConfigParams, configParam } from '../../config'
import { inspect } from 'util'
import chalk from 'chalk'

export default class ConfigGet extends Command {

  static description = 'get a CLI configuration parameter'

  static hidden: true

  static flags = {
    // help: flags.help({char: 'h'}),
  }

  static args = [
    { name: 'param', required: true, description: 'configuration parameter name' },
  ]

  async run() {

    const { args } = await this.parse(ConfigGet)

    const param = args.param

    if (Object.keys(ConfigParams).includes(param)) {
      this.log(`\n${chalk.blueBright(param)} = ${inspect(configParam(param), false, null, true)}\n`)
    } else this.error(`Invalid configuration param: ${chalk.italic.redBright(param)}`)

  }

}
