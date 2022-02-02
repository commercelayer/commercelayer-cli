import { clColor } from '@commercelayer/cli-core'
import { Command, Flags } from '@oclif/core'
import clicfg, { ConfigParamsEditable, configParam, paramDefault, ConfigParams } from '../../config'


export default class ConfigDefault extends Command {

  static description = 'reset CLI configuration to default values'

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

  static args = []

  async run() {

    const { flags } = await this.parse(ConfigDefault)


    if (!flags.force) this.error(`To avoid unintentional changes to CLI configuration, please use the ${clColor.cli.flag('--force (-F)')} flag to force setting save`)


    // Set default value for all editable properties
    Object.keys(ConfigParamsEditable).forEach(k => configParam(k as ConfigParams, paramDefault(k as unknown as ConfigParamsEditable)))
    // Delete all test params
    Object.keys(ConfigParamsEditable).filter(k => k.startsWith('test')).forEach(k => clicfg.delete(k))

    this.log(clColor.yellowBright('\nSuccessfully restored default CLI configuration\n'))

  }

}
