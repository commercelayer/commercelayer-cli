import { clColor, clConfig } from '@commercelayer/cli-core'
import { Command, Flags } from '@oclif/core'
import open from 'open'


export default class LinksResources extends Command {

  static override description = 'show linkable resources'

  static override examples = [
    'commercelayer links:resources'
  ]


  static flags = {
    open: Flags.boolean({
      char: 'O',
      description: 'open online documentation page'
    })
  }


  public async run(): Promise<void> {

    const { flags } = await this.parse(LinksResources)

    this.log()
    this.log(clColor.style.title('Supported linkable resources'))
    this.log()
    this.log((clConfig.links.linkable_resources as string[]).sort().join(' | '))
    this.log()

    if (flags.open) await open(clConfig.doc.links_resources)

  }

}
