import { Command, flags } from '@oclif/command'
import clicfg, { ConfigParams } from '../../config'
import chalk from 'chalk'

export default class ConfigDel extends Command {

  static description = 'delete a CLI configuration parameter'

  static hidden: true

  static flags = {
    force: flags.boolean({
      char: 'F',
      required: false,  // checked programmatically later
      hidden: true,
      description: 'mandatory flag to avoid unintentional config changes',
    }),
  }

  static args = [
    { name: 'param', required: true, description: 'configuration parameter name' },
  ]

  async run() {

    const { args, flags } = this.parse(ConfigDel)

    const param = args.param

    if (Object.keys(ConfigParams).includes(param)) {
      if (!flags.force) this.error(`To avoid unintentional changes to CLI configuration, please use the ${chalk.italic('--force (-F)')} flag to force parameter deletion`)
      clicfg.delete(param)
      this.log(`\nParameter ${chalk.yellowBright(param)} correctly deleted from configuration\n`)
    } else this.error(`Invalid configuration param: ${chalk.italic.redBright(param)}`)

  }

}
