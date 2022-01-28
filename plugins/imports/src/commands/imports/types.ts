import { Command } from '@oclif/core'
import cliux from 'cli-ux'
import chalk from 'chalk'
import { clConfig } from '@commercelayer/cli-core'


export default class ImportsTopics extends Command {

  static description = 'show online documentation for supported resources'

  static aliases = ['imp:types']

  static examples = [
		'$ commercelayer imports:types',
		'$ cl imp:types',
	]


  async run() {

    this.log()
    this.log(chalk.blueBright('Supported import types'))
    this.log()
    this.log(clConfig.imports.types.sort().join(' | '))
    this.log()

    await cliux.open('https://docs.commercelayer.io/api/importing-resources#supported-resources')

  }

}
