import { BaseIdCommand } from '../../base'
import { clColor } from '@commercelayer/cli-core'


export default class LinksDisable extends BaseIdCommand {

  static override description = 'disable an existing enabled link'

  static override examples = [
    'commercelayer links:disable <link-id>'
  ]


  static override args = {
    ...BaseIdCommand.args
  }


  public async run(): Promise<void> {

    const { args, flags } = await this.parse(LinksDisable)

    const id = args.id

    this.commercelayerInit(flags)

    const link = await this.cl.links.update({ id, _disable: true })

    this.log(`\n${clColor.style.success('Successfully')} disabled link with id ${clColor.style.id(link.id)}\n`)

  }

}
