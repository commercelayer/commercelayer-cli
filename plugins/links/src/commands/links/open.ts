import { clColor } from '@commercelayer/cli-core'
import { BaseIdCommand } from '../../base'
import open from 'open'


export default class LinksOpen extends BaseIdCommand {

  static override description = 'open an existent resource link'

  static override examples = [
    'commercelayer links:open <link-id>',
  ]


  static override args = {
    ...BaseIdCommand.args
  }


  public async run(): Promise<void> {

    const { args, flags } = await this.parse(LinksOpen)

    const id = args.id

    this.commercelayerInit(flags)

    const link = await this.cl.links.retrieve(id).catch(err => {
      if (this.cl.isApiError(err) && (err.status === 404)) {
        this.log(`\nLink ${clColor.api.id(id)} not found\n`)
        this.exit()
      }
    })
    if (!link) return


    if (link.url) await open(link.url)
    else this.error('Link\'s URL is empty')

  }

}
