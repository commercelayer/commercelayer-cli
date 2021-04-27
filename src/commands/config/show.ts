import { Command } from '@oclif/command'
import clicfg from '../../config'
import { inspect } from 'util'
import chalk from 'chalk'

export default class ConfigShow extends Command {

  static description = 'show current CLI configuration'

  static hidden: true

  static flags = { }

  static args = [ ]

  async run() {

    this.log(`\n${chalk.blueBright('-= Commerce Layer CLI configuration =-')}\n`)
    this.log(inspect(clicfg.all, false, null, true))
    this.log()

  }

}
