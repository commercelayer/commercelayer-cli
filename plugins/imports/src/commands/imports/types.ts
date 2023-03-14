import { Command, Flags } from '@oclif/core'
import { clColor, clConfig } from '@commercelayer/cli-core'
import open from 'open'



export default class ImportsTypes extends Command {

  static description = 'show online documentation for supported resources'

  static aliases = ['imp:types']

  static examples = [
		'$ commercelayer imports:types',
		'$ cl imp:types',
	]


  static flags = {
    open: Flags.boolean({
      char: 'O',
      description: 'open online documentation page',
    }),
  }


  async run(): Promise<any> {

    const { flags } = await this.parse(ImportsTypes)

    this.log()
    this.log(clColor.style.title('Supported import types'))
    this.log()
    this.log((clConfig.imports.types as string[]).sort().join(' | '))
    this.log()

    if (flags.open) await open(clConfig.doc.imports_resources)

  }

}
