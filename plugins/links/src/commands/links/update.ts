import { Flags } from '@oclif/core'
import { BaseEditCommand, BaseIdCommand } from '../../base'
import type { LinkUpdate } from '@commercelayer/sdk'
import { clColor, clOutput } from '@commercelayer/cli-core'
import open from 'open'



export default class LinksUpdate extends BaseEditCommand {

  static override description = 'create a new resource link'

  static override examples = [
    'commercelayer links:update -t <item-type> -i <item-id> -S market:<market-id> -n <link-name> -e 2050-12-15 -I <sales_channel-client-id>'
  ]

  static override flags = {
    open: Flags.boolean({
      description: 'open link in default browser'
    })
  }


  static override args = {
    ...BaseIdCommand.args,
    ...BaseEditCommand.args,
  }


  public async run(): Promise<void> {

    const { args, flags } = await this.parse(LinksUpdate)

    this.commercelayerInit(flags)

    const id = args.id

    // itemType / itemId
    const itemType = flags.item_type || ''
    const itemId = flags.item_id || ''
    let item: LinkUpdate['item']
    if (itemType || itemId) {
      item = await this.checkItem(itemType, itemId)
      this.checkRequired({ item_type: item.type }, 'item_type', 'Item type')
      this.checkRequired({ item_id: item.id }, 'item_id', 'Item ID')
    }

    const client_id = flags.client_id ? this.checkClientId(flags.client_id) : undefined

    const starts_at = flags.starts ? this.checkDateValue(flags.starts) : undefined
    const expires_at = flags.expires ? this.checkDateValue(flags.expires) : undefined

    const scope = this.checkScope(flags.scope) || undefined
    const name = flags.name
    const domain = flags.domain

    if (!itemType && !itemId && !client_id && ! starts_at && !expires_at && !scope && !name && !domain)
      this.error(`At least one field of link ${clColor.bold.yellowBright(id)} must be updated`)

    const linkUpdate: LinkUpdate = {
      id,
      client_id,
      name,
      scope,
      starts_at,
      expires_at,
      item,
      domain
    }

    let link = await this.cl.links.retrieve(id).catch(() => {
      this.error(`\nUnable find link ${clColor.msg.error(id)}\n`)
    })

    try {

      link = await this.cl.links.update(linkUpdate, {
          include: ['item'],
          fields: { orders: ['number'], sku_lists: ['name'], bundles: ['name', 'code'], skus: ['name', 'code']}
        }
      )

      if (link.url) {
        this.log(`\n${clColor.yellowBright('LINK')}: ${clColor.cyanBright(link.url)}`)
        if (flags.open) await open(link.url)
      }

      this.log(`\n${clColor.msg.success('Successfully')} update link ${clColor.bold.yellowBright(link.id)} for resource of type ${clColor.bold(link.item?.type)} and id ${clColor.api.id(link.item?.id)}\n`)

    } catch (error: any) {
      this.error(`\n${clOutput.formatError(error)}\n\n${clColor.msg.error('Error')} updating link ${clColor.bold.yellowBright(linkUpdate.id)}\n`)
    }

  }

}
