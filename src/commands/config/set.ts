import { Command, Flags, Args } from '@oclif/core'
import { paramExists, paramEditable, configParam, ConfigParams } from '../../config'
import { inspect } from 'util'
import { clColor } from '@commercelayer/cli-core'


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

  static args = {
    param: Args.string({ name: 'param', required: true, description: 'configuration parameter name' }),
    value: Args.string({ name: 'value', required: true, description: 'value to be saved in configuration file'  }),
  }

  async run(): Promise<any> {

    const { args, flags } = await this.parse(ConfigSet)

    const param = args.param
    const value = args.value

    if (paramExists(param)) {
      const paramKey = ConfigParams[param as keyof typeof ConfigParams]
      if (paramEditable(paramKey)) {
        if (!flags.force) this.error(`To avoid unintentional changes to CLI configuration, please use the ${clColor.cli.flag('--force (-F)')} flag to force setting save`)
        configParam(paramKey, value)
        this.log(`\n${clColor.table.key.blueBright(param)} = ${inspect(configParam(paramKey), false, null, true)}\n`)
      } else this.error(`Readonly configuration param: ${clColor.msg.error(param)}`)
    } else this.error(`Invalid configuration param: ${clColor.msg.error(param)}`)

  }

}
