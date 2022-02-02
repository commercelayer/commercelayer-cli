import { Command, CliUx as cliux } from '@oclif/core'
import { clColor, clConfig } from '@commercelayer/cli-core'



export default class ImportsTopics extends Command {

  static description = 'show online documentation for supported resources'

  static aliases = ['imp:types']

  static examples = [
		'$ commercelayer imports:types',
		'$ cl imp:types',
	]


  async run() {

    this.log()
    this.log(clColor.style.title('Supported import types'))
    this.log()
    this.log(clConfig.imports.types.sort().join(' | '))
    this.log()

    await cliux.ux.open('https://docs.commercelayer.io/api/importing-resources#supported-resources')

  }

}
