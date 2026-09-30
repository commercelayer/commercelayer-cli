import { clColor } from '@commercelayer/cli-core'
import { BaseIdCommand } from '../../base'


export default class LinksEnable extends BaseIdCommand {

  static override description = 'enable an existent disabled link'

  static override examples = [
    'commercelayer links:enable <link-id>'
  ]


  static override args = {
    ...BaseIdCommand.args
  }


  public async run(): Promise<void> {

    const { args, flags } = await this.parse(LinksEnable)

    const id = args.id

    this.commercelayerInit(flags)

    const link = await this.cl.links.update({ id, _enable: true })

    this.log(`\n${clColor.style.success('Successfully')} deleted link with id ${clColor.style.id(link.id)}\n`)

  }

}
