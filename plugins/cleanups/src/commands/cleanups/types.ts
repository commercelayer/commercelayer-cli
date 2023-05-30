import { Command, Flags } from '@oclif/core'
import { clColor, clConfig } from '@commercelayer/cli-core'
import open from 'open'



export default class ExportsTypes extends Command {

  static description = 'show online documentation for supported resources'

  static aliases = ['clp:types']

  static examples = [
		'$ commercelayer cleanups:types',
		'$ cl exp:types',
	]


  static flags = {
    open: Flags.boolean({
      char: 'O',
      description: 'open online documentation page',
    }),
  }


  async run(): Promise<any> {

    const { flags } = await this.parse(ExportsTypes)

    this.log()
    this.log(clColor.style.title('Supported cleanup types'))
    this.log()
    this.log((clConfig.exports.types as string[]).sort().join(' | '))
    this.log()

    if (flags.open) await open(clConfig.doc.cleanups_resources)

  }

}
