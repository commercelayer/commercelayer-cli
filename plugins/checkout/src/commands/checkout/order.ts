import { CommerceLayerStatic } from '@commercelayer/sdk'
import Command from '../../base'
import { clOutput } from '@commercelayer/cli-core'
import { buildCheckoutUrl, openCheckoutUrl } from '../../url'
import chalk from 'chalk'


export default class CheckoutOrder extends Command {

  static description = 'create checkout URLs starting from an existing order'

  static flags = {
    ...Command.flags,
  }

  static args = [
    { name: 'id', description: 'unique id of the order', required: true },
  ]


  async run() {

    const { args, flags } = this.parse(CheckoutOrder)

    const id = args.id
    const organization = flags.organization
    const accessToken = flags.accessToken

    const cl = this.commercelayerInit(flags)

    try {

      const order = await cl.orders.retrieve(id, { fields: { orders: ['id', 'number'] } })

      this.checkApplication(accessToken, 'sales_channel')

      const checkoutUrl = buildCheckoutUrl(organization, order.id, accessToken)

      this.log(`\nCheckout URL for order ${chalk.yellowBright(order.id)}:\n`)
      this.log(chalk.cyanBright(checkoutUrl))
      this.log()

      if (flags.open) openCheckoutUrl(checkoutUrl)

    } catch (error) {
      if (CommerceLayerStatic.isApiError(error)) {
        this.error(clOutput.formatError(error, flags))
      } else throw error
    }

  }

}
