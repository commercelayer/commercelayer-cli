import { CommerceLayerStatic } from '@commercelayer/sdk'
import Command, { Args } from '../../base'
import { clColor, clOutput } from '@commercelayer/cli-core'
import { buildCheckoutUrl, openCheckoutUrl } from '../../url'


export default class CheckoutOrder extends Command {

  static description = 'create checkout URLs starting from an existing order'

  static examples = [
    '$ commercelayer checkout:order <order-id>',
  ]


  static args = {
    id: Args.string({ name: 'id', description: 'unique id of the order', required: true })
  }


  async run(): Promise<any> {

    const { args, flags } = await this.parse(CheckoutOrder)

    const id = args.id
    const organization = flags.organization
    const accessToken = flags.accessToken
    const domain = flags.domain
    const staging = flags.staging

    const cl = this.commercelayerInit(flags)

    try {

      this.checkAcessTokenData(accessToken, flags)

      const order = await cl.orders.retrieve(id, { fields: { orders: ['id', 'number'] } })

      const checkoutUrl = buildCheckoutUrl(organization, order.id, accessToken, { domain, staging })

      this.log(`\nCheckout URL for order ${clColor.api.id(order.id)}:\n`)
      this.log(clColor.cyanBright(checkoutUrl))
      this.log()

      if (flags.open) await openCheckoutUrl(checkoutUrl)

    } catch (error) {
      if (CommerceLayerStatic.isApiError(error)) {
        this.error(clOutput.formatError(error, flags))
      } else throw error
    }

  }

}
