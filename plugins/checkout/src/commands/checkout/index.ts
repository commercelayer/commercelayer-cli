import Command, { Flags } from '../../base'
import CheckoutOrder from './order'
import { LineItemCreate } from '@commercelayer/sdk'
import { buildCheckoutUrl, openCheckoutUrl } from '../../url'
import { clColor } from '@commercelayer/cli-core'


export default class CheckoutIndex extends Command {

  static description = 'create checkout URLs'

  static examples = [
    '$ commercelayer checkout -O <order-id>',
    '$ cl checkout -S <sku-code> -m <market-id> -c <coupon-code> -e <email-address>',
    '$ cl checkout -S <sku-code-1> -S <sku-code-2> -m <market-id>',
  ]

  static flags = {
    ...Command.flags,
    order: Flags.string({
      char: 'O',
      description: 'an order id',
      exclusive: ['sku', 'bundle'],
      multiple: false,
    }),
    sku: Flags.string({
      char: 'S',
      description: 'an SKU code',
      exclusive: ['order'],
      multiple: true,
    }),
    bundle: Flags.string({
      char: 'B',
      description: 'a bundle code',
      exclusive: ['order'],
      multiple: true,
    }),
    market: Flags.string({
      char: 'm',
      description: 'a market number',
      exclusive: ['order'],
    }),
    coupon: Flags.string({
      char: 'c',
      description: 'a promo code',
      exclusive: ['order'],
    }),
    email: Flags.string({
      char: 'e',
      description: 'a customer email',
      exclusive: ['order'],
    }),
    /*
    'set-defaults': flags.boolean({
      char: 'D',
      description: 'set order defaults',
      dependsOn: ['sku'],
    }),
    place: flags.boolean({
      char: 'P',
      description: 'place the rorder',
      dependsOn: ['sku'],
    }),
    */
  }


  async run(): Promise<any> {

    const { flags } = await this.parse(CheckoutIndex)

    const organization = flags.organization
    const accessToken = flags.accessToken


    // Checkout URL by order id
    if (flags.order) {
      const args = [flags.order, '-o', organization, '-a', accessToken]
      if (flags.open) args.push('--open')
      if (flags.domain) args.push('-d', flags.domain)
      return CheckoutOrder.run(args, this.config)
    }


    if (!flags.sku && !flags.bundle) this.error(`One of the options ${clColor.cli.flag.cyanBright('--order (-O)')}, ${clColor.cli.flag.cyanBright('--sku (-S)')} or ${clColor.cli.flag.cyanBright('--bundle (-B)')} is required`)

    this.checkApplication(accessToken, 'sales_channel')

    // Parse SKU and Bundle options
    const skus: string[] = this.parseItems(flags.sku)
    const bundles: string[] = this.parseItems(flags.bundle)

    // Build line items
    const lineItems: LineItemCreate[] = this.buildLineItems(skus, bundles)

    const cl = this.commercelayerInit(flags)

    // Check SKUs existence
    const liSkus = lineItems.filter(li => li.item_type === 'sku')
    const clSkus = await cl.skus.list({ filters: { code_matches_any: liSkus.map(li => li.sku_code).join(',') } })
    liSkus.forEach(li => {
      if (!clSkus.some(cls => cls.code === li.sku_code)) this.error(`Inexistent ${this.itemName('sku')}: ${clColor.msg.error(String(li.sku_code))}`)
    })

    // Check bundles existence
    const liBundles = lineItems.filter(li => li.item_type === 'bundle')
    const clBundles = await cl.bundles.list({ filters: { code_matches_any: liBundles.map(li => li.bundle_code).join(',') } })
    liBundles.forEach(li => {
      if (!clBundles.some(clb => clb.code === li.bundle_code)) this.error(`Inexistent ${this.itemName('bundle')}: ${clColor.msg.error(String(li.bundle_code))}`)
    })

    // Create order
    const market = flags.market
    const coupon = flags.coupon
    const email = flags.email

    const order = await cl.orders.create({
      customer_email: email,
      coupon_code: coupon,
      market: market ? cl.markets.relationship(market) : undefined,
    })
    this.log(`\nCreated order ${clColor.api.id(order.id)}`)


    // Create line items
    const lis: Promise<LineItemCreate | void>[] = []

    lineItems.forEach(async li => {
      li.order = cl.orders.relationship(order)
      const lineItem = cl.line_items.create(li).then(lic => {
        const liName = this.itemName(li.item_type || '')
        const liCode = (['sku', 'skus'].includes(lic.item_type || '')) ? lic.sku_code : lic.bundle_code
        this.log(`Created line item ${clColor.api.id(lic.id)} for ${liName} ${clColor.cli.value.italic(String(liCode))} and associated to order ${clColor.api.id(order.id)}`)
      })
      if (lineItem) lis.push(lineItem)
    })

    await Promise.all(lis)

    const checkoutUrl = buildCheckoutUrl(organization, order.id, accessToken)

    this.log(`\nCheckout URL for order ${clColor.api.id(order.id)}:\n`)
    this.log(clColor.cyanBright(checkoutUrl))
    this.log()

    if (flags.open) await openCheckoutUrl(checkoutUrl)

  }


  private parseItems(itemsFlags?: string[]): string[] {
    const items: string[] = []
    if (itemsFlags) itemsFlags.forEach((i: string) => items.push(...i.split(',')))
    return items
  }


  private checkItem(item: string, type: string): { code: string; quantity: number; type: string } {

    const def = item.split(':')
    if (def.length > 2) this.error(`Invalid ${this.itemName(type)} option: ${clColor.msg.error(item)}`)

    const code = def[0]
    const quantity = Number((def.length > 1) ? def[1] : 1)
    if (Number.isNaN(quantity) || (quantity < 0)) this.error(`Invalid ${this.itemName(type)} definition: ${clColor.msg.error(item)}`)

    return {
      code,
      quantity,
      type,
    }

  }


  private itemName(itemType: string): string {
    switch (itemType) {
      case 'skus':
      case 'sku': return 'SKU'
      case 'bundles':
      case 'bundle': return 'bundle'
      default: return itemType
    }
  }


  private buildLineItems(skus?: string[], bundles?: string[]): LineItemCreate[] {

    const lineItems: LineItemCreate[] = []

    // SKUs
    if (skus && (skus.length > 0)) skus.forEach(s => {
      const checkSku = this.checkItem(s, 'sku')
      lineItems.push({
        item_type: checkSku.type,
        sku_code: checkSku.code,
        quantity: checkSku.quantity,
        _update_quantity: true,
        order: { id: '', type: 'orders' },
      })
    })

    // Bundles
    if (bundles && (bundles.length > 0)) bundles.forEach(b => {
      const checkBundle = this.checkItem(b, 'bundle')
      lineItems.push({
        item_type: checkBundle.type,
        bundle_code: checkBundle.code,
        quantity: checkBundle.quantity,
        _update_quantity: true,
        order: { id: '', type: 'orders' },
      })
    })

    return lineItems

  }

}
