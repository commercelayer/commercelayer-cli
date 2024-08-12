import { Flags } from '@oclif/core'
import { BaseEditCommand } from '../../base'
import { type LinkCreate } from '@commercelayer/sdk'
import { clApi, clColor, clOutput, clText } from '@commercelayer/cli-core'
import open from 'open'



export default class LinksCreate extends BaseEditCommand {

  static override description = 'create a new resource link'

  static aliases = ['link']

  static override examples = [
    'commercelayer links:create -t <item-type> -i <item-id> -S market:<market-id> -n <link-name> -e 2050-12-15 -I <sales_channel-client-id>'
  ]

  static override flags = {
    open: Flags.boolean({
      description: 'open link in default browser'
    })
  }


  static override args = {
    ...BaseEditCommand.args
  }


  public async run(): Promise<void> {

    const { flags } = await this.parse(LinksCreate)

    this.commercelayerInit(flags)

    // itemType / itemId
    const itemType = this.checkRequired(flags, 'item_type', 'Item type')
    const itemId = flags.item_id
    const item = await this.checkItem(itemType, itemId)
    this.checkRequired({ item_id: item.id }, 'item_id', 'Item ID')

    // Defaults
    flags.starts = flags.starts || new Date().toISOString()
    flags.name = flags.name || `Link for ${clText.singularize(clApi.humanizeResource(item.type))} ${item.code}`

    const client_id = this.checkClientId(this.checkRequired(flags, 'client_id', 'Client ID'))

    const starts_at = this.checkDateValue(this.checkRequired(flags, 'starts', 'Start date'))
    const expires_at = this.checkDateValue(this.checkRequired(flags, 'expires', 'Expiration date'))

    const scope = this.checkScope(this.checkRequired<string[]>(flags, 'link_scope', 'Scope'))
    const name = this.checkRequired(flags, 'name')
    const domain = flags.domain

    const linkCreate: LinkCreate = {
      client_id,
      name,
      scope,
      starts_at,
      expires_at,
      item,
      domain
    }

    try {

      const link = await this.cl.links.create(linkCreate, {
          include: ['item'],
          fields: { orders: ['number'], sku_lists: ['name'], bundles: ['name', 'code'], skus: ['name', 'code'] }
        }
      )

      if (link.url) {
        this.log(`\n${clColor.yellowBright('LINK')}: ${clColor.cyanBright(link.url)}`)
        if (flags.open) await open(link.url)
      }

      this.log(`\n${clColor.msg.success('Successfully')} created new link ${clColor.bold.yellowBright(link.id)} for resource of type ${clColor.bold(link.item?.type)} and id ${clColor.api.id(link.item?.id)}\n`)

    } catch (error: any) {
      this.error(`\n${clOutput.formatError(error)}\n\n${clColor.msg.error('Error')} creating new link for resource of type ${clColor.bold(item.type)} and id ${clColor.api.id(item.id)}\n`)
    }

  }

}
