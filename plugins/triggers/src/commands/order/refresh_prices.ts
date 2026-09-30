import type { Order } from '@commercelayer/sdk'
import Command from '../../base'
import { triggers } from '../../triggers/orders'


const TRIGGER = 'refresh_prices'


export default class OrderRefreshPrices extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(OrderRefreshPrices)

		const res = await this.executeAction<Order>('orders', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('order', TRIGGER, res.id)

    return res

	}

}
