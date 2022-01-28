import { Command } from '@oclif/core'
import clicfg from '../../config'
import { inspect } from 'util'
import chalk from 'chalk'

export default class ConfigShow extends Command {

  static description = 'show current CLI configuration'

  static hidden: true

  static flags = {
    // help: flags.help({char: 'h'}),
  }

  static args = []

  async run() {

    const config = clicfg.all

    if (!config || (Object.keys(config).length === 0)) this.warn(chalk.italic('CLI configuration is empty'))
    else {
      this.log(`\n${chalk.blueBright('-= Commerce Layer CLI configuration =-')}\n`)
      this.log(inspect(clicfg.all, false, null, true))
      this.log()
    }

  }

}
