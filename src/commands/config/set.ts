import { Command, Flags } from '@oclif/core'
import { paramExists, paramEditable, configParam } from '../../config'
import { inspect } from 'util'
import chalk from 'chalk'

export default class ConfigSet extends Command {

  static description = 'set a CLI configuration parameter'

  static hidden: true

  static flags = {
    // help: flags.help({char: 'h'}),
    force: Flags.boolean({
      char: 'F',
      required: false,  // checked programmatically later
      hidden: true,
      description: 'mandatory flag to avoid unintentional config changes',
    }),
  }

  static args = [
    { name: 'param', required: true, description: 'configuration parameter name' },
    { name: 'value', required: true, description: 'value to be saved in configuration file'  },
  ]

  async run() {

    const { args, flags } = await this.parse(ConfigSet)

    const param = args.param
    const value = args.value

    if (paramExists(param)) {
      if (paramEditable(param)) {
        if (!flags.force) this.error(`To avoid unintentional changes to CLI configuration, please use the ${chalk.italic('--force (-F)')} flag to force setting save`)
        configParam(param, value)
        this.log(`\n${chalk.blueBright(param)} = ${inspect(configParam(param), false, null, true)}\n`)
      } else this.error(`Readonly configuration param: ${chalk.italic.redBright(param)}`)
    } else this.error(`Invalid configuration param: ${chalk.italic.redBright(param)}`)

  }

}
