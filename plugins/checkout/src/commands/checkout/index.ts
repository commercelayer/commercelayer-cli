import Command, { flags } from '../../base'
import CheckoutOrder from './order'
import chalk from 'chalk'
import { LineItemCreate } from '@commercelayer/sdk'
import { buildCheckoutUrl, openCheckoutUrl } from '../../url'

export default class CheckoutIndex extends Command {

  static description = 'create checkout URLs'

  static examples = [
		'$ commercelayer checkout -O <order-id>',
		'$ cl checkout -S <sku-code> -m <market-id> -c <coupon-code> -e <email-address>',
    '$ cl checkout -S <sku-code-1> -S <sku-code-2> -m <market-id>',
	]

  static flags = {
    ...Command.flags,
    order: flags.string({
      char: 'O',
      description: 'an order id',
      exclusive: ['sku'],
      multiple: false,
    }),
    sku: flags.string({
      char: 'S',
      description: 'an SKU code',
      exclusive: ['order'],
      multiple: true,
    }),
    market: flags.string({
      char: 'm',
      description: 'a market number',
      dependsOn: ['sku'],
    }),
    coupon: flags.string({
      char: 'c',
      description: 'a promo code',
      dependsOn: ['sku'],
    }),
    email: flags.string({
      char: 'e',
      description: 'a customer email',
      dependsOn: ['sku'],
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


  async run() {

    const { flags } = this.parse(CheckoutIndex)

    const organization = flags.organization
    const accessToken = flags.accessToken


    // Checkout URL by order id
    if (flags.order) {
      const args = [flags.order, '-o', organization, '-a', accessToken]
      if (flags.open) args.push('--open')
      if (flags.domain) args.push('-d', flags.domain)
      return CheckoutOrder.run(args, this.config)
    }


    if (!flags.sku) this.error(`One of the options ${chalk.cyanBright('--order (-O)')} or ${chalk.cyanBright('--sku (-S)')} is required`)

    this.checkApplication(accessToken, 'sales_channel')

    // Parse SKU options
    const skus: string[] = this.parseSKUs(flags)

    // Build line items
    const lineItems: LineItemCreate[] = this.buildLineItems(skus)

    const cl = this.commercelayerInit(flags)

    const clSkus = await cl.skus.list({ filters: { code_matches_any: lineItems.map(li => li.sku_code).join(',') } })
    lineItems.forEach(li => {
      if (!clSkus.some(cls => cls.code === li.sku_code)) this.error(`Inexistent SKU: ${li.sku_code}`)
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
    this.log(`\nCreated order ${chalk.bold(order.id)}`)

    // Create line items
    const lis: Promise<LineItemCreate | void>[] = []
    lineItems.forEach(async li => {
      li.order = cl.orders.relationship(order)
      const lineItem = cl.line_items.create(li).then(li =>
        this.log(`Created line item ${chalk.bold(li.id)} for SKU ${chalk.italic(li.sku_code || '')} and associated to order ${chalk.bold(order.id)}`)
      )
      if (lineItem) lis.push(lineItem)
    })

    await Promise.all(lis)

    const checkoutUrl = buildCheckoutUrl(organization, order.id, accessToken)

    this.log(`\nCheckout URL for order ${chalk.yellowBright(order.id)}:\n`)
    this.log(chalk.cyanBright(checkoutUrl))
    this.log()

    if (flags.open) openCheckoutUrl(checkoutUrl)

  }


  private parseSKUs(flags: any): string[] {
    const skus: string[] = []
    flags.sku.forEach((s: string) => skus.push(...s.split(',')))
    return skus
  }


  private buildLineItems(skus: string[]): LineItemCreate[] {

    const lineItems: LineItemCreate[] = []

    skus.forEach(s => {

      const sd = s.split(':')
      if (sd.length > 2) this.error('Invalid SKU option: ' + chalk.redBright(s))

      const quantity = Number((sd.length > 1) ? sd[1] : 1)
      if (Number.isNaN(quantity) || (quantity < 0)) this.error('Invalid SKU definition: ' + chalk.redBright(s))

      lineItems.push({
        sku_code: sd[0],
        quantity,
        _update_quantity: true,
      })

    })

    return lineItems

  }

}
