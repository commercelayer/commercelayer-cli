import { clColor } from '@commercelayer/cli-core'
import { Command, Flags } from '@oclif/core'
import clicfg, { ConfigParams } from '../../config'


export default class ConfigDel extends Command {

  static description = 'delete a CLI configuration parameter'

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
  ]

  async run(): Promise<any> {

    const { args, flags } = await this.parse(ConfigDel)

    const param = args.param

    if (Object.keys(ConfigParams).includes(param)) {
      if (!flags.force) this.error(`To avoid unintentional changes to CLI configuration, please use the ${clColor.cli.flag('--force (-F)')} flag to force parameter deletion`)
      clicfg.delete(param)
      this.log(`\nParameter ${clColor.yellowBright(param)} correctly deleted from configuration\n`)
    } else this.error(`Invalid configuration param: ${clColor.msg.error(param)}`)

  }

}
