import { Command } from '@oclif/command'
import cliux from 'cli-ux'
import chalk from 'chalk'
import { config } from '@commercelayer/cli-core'


export default class ImportsTopics extends Command {

  static description = 'show online documentation for supported resources'


  async run() {

    this.log()
    this.log(chalk.blueBright('Supported import types'))
    this.log()
    this.log(config.imports.types.sort().join(' | '))
    this.log()

    await cliux.open('https://docs.commercelayer.io/api/importing-resources#supported-resources')

  }

}
