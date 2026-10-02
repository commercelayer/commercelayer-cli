/* eslint-disable @typescript-eslint/unbound-method */
import { CLCommand, clColor, clConfig } from '@commercelayer/cli-core'
import * as cliux from '@commercelayer/cli-ux'
import type { CommerceLayerClient, ListResponse, Tag, TaggableResource, TaggableResourceType } from '@commercelayer/sdk'
import commercelayer, { CommerceLayerStatic } from '@commercelayer/sdk'
import type { Interfaces } from '@oclif/core'
import { Args, Flags } from '@oclif/core'

type CommandError = Interfaces.CommandError





export default abstract class BaseCommand extends CLCommand {

  static applicationKinds = ['integration']


  protected cl!: CommerceLayerClient



  protected commercelayerInit(flags: any): CommerceLayerClient {
    this.cl = commercelayer(this.clientOptions(flags))
    return this.cl
  }



  protected handleError(error: CommandError, flags?: any, id?: string): void {
    if (CommerceLayerStatic.isApiError(error)) this.handleApiError(error, { resource: 'tag', id, idLabel: 'ID or name', flags })
    else throw error
  }


  protected checkName(name?: string, blocking?: boolean): string | undefined {
    const ok = name && clConfig.tags.tag_name_pattern.test(name)
    if (!ok) (blocking ? this.error : this.warn)(`Invalid tag name: ${clColor.msg.error(name)}`)
    return name
  }


  protected filterFlagName(flag: string[]): string[] {
    return this.filterFlagMulti(flag, this.checkName)
  }


  protected filterFlagMulti(flag: string[], filter?: (s: string) => boolean | string | undefined): string[] {
    if (!flag || (flag.length === 0)) return flag
    const merged = flag.join(',').split(',').filter(t => ((t !== undefined) && (t !== '')))
    return filter? merged.filter(filter) : merged
  }


  protected async checkTag(idOrName: string, blocking?: boolean): Promise<Tag | undefined> {

    let tag: Tag | undefined

    try {
      tag = await this.cl.tags.retrieve(idOrName)
    } catch (err) {
      if (this.cl.isApiError(err) && (err.status === 404)) tag = undefined
      else throw err
    }

    if (!tag) tag = (await this.cl.tags.list({ filters: { name_eq: idOrName } })).first()

    if (!tag) {
      console.log(`${blocking ? '\n' : ''}Unable to find tag with this ID or name: ${clColor.msg.error(idOrName)}${blocking ? '\n' : ''}`)
      if (blocking) this.exit()
    }

    return tag

  }


  protected checkResourceType(type: string): boolean {
    if (!CommerceLayerStatic.resources().includes(type)) this.error(`Invalid resource type: ${clColor.msg.error(type)}`)
    return true
  }


  protected async findByFriendlyAttribute(value: string, type: TaggableResourceType): Promise<TaggableResource | undefined> {

    let attribute: string | undefined

    switch (type) {
      case 'returns':
      case 'shipments':
      case 'orders': { attribute = 'number'; break }
      case 'bundles':
      case 'coupons':
      case 'gift_cards':
      case 'skus': { attribute = 'code'; break }
      case 'buy_x_pay_y_promotions':
      case 'external_promotions':
      case 'fixed_amount_promotions':
      case 'fixed_price_promotions':
      case 'free_gift_promotions':
      case 'free_shipping_promotions':
      case 'percentage_discount_promotions':
      case 'promotions':
      case 'line_item_options':
      case 'sku_options': { attribute = 'name'; break }
      case 'customers': { attribute = 'email'; break }

    }

    let resource: TaggableResource | undefined
    if (attribute) {
      const client: any = this.cl[type as keyof CommerceLayerClient]
      const resources = await client.list({ filters: { [`${attribute}_eq`]: value }, include: ['tags'] })
      resource = (resources as ListResponse<TaggableResource>).first()
    }

    return resource

  }

}



export abstract class BaseIdCommand extends BaseCommand {

  static args = {
    id_name: Args.string({ name: 'id_name', description: 'unique id or name of the tag', required: true, hidden: false }),
  }

}



export { Args, cliux, Flags }
