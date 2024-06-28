import { BaseIdCommand } from '../../base'
import { clColor } from '@commercelayer/cli-core'

export default class LinksDelete extends BaseIdCommand {

  static override description = 'delete an existent resource link'

  static override examples = [
    'commercelayer links:delete <link-id>',
  ]


  static override args = {
    ...BaseIdCommand.args
  }


  public async run(): Promise<void> {

    const { args, flags } = await this.parse(LinksDelete)

    const id = args.id

    this.commercelayerInit(flags)

    await this.cl.links.delete(id)
      .catch(err => {
        if (this.cl.isApiError(err) && (err.status === 404)) {
          this.log(`\nLink ${clColor.api.id(id)} not found\n`)
          this.exit()
        }
      })


    this.log(`\n${clColor.style.success('Successfully')} deleted link with id ${clColor.style.id(id)}\n`)

  }

}
