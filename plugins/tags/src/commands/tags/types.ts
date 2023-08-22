import { Command, Flags } from '@oclif/core'
import { clColor, clConfig } from '@commercelayer/cli-core'
import open from 'open'



export default class ExportsTypes extends Command {

  static description = 'show online documentation for supported resources'

  static examples = [
		'$ commercelayer tags:types'
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
    this.log(clColor.style.title('Taggable resources'))
    this.log()
    this.log((clConfig.tags.taggable_resources as string[]).sort().join(' | '))
    this.log()

    if (flags.open) await open(clConfig.doc.tags_resources)

  }

}
