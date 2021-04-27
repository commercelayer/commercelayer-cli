import { Command, flags } from '@oclif/command'
import clicfg, { ConfigParams } from '../../config'
import chalk from 'chalk'

export default class ConfigDefault extends Command {

  static description = 'reset CLI configuration to default values'

  static hidden: true

  static flags = {
    force: flags.boolean({
      char: 'F',
      required: false,  // checked programmatically later
      hidden: true,
      description: 'mandatory flag to avoid unintentional config changes',
    }),
  }

  static args = []

  async run() {

    const { flags } = this.parse(ConfigDefault)


    if (!flags.force) this.error(`To avoid unintentional changes to CLI configuration, please use the ${chalk.italic('--force (-F)')} flag to force setting save`)

    clicfg.delete(ConfigParams.currentApplication)

    this.log(chalk.yellowBright('\nSuccessfully restored default CLI configuration\n'))

  }

}
