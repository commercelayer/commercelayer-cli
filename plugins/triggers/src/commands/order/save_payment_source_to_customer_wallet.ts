import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/orders'


const TRIGGER = 'save_payment_source_to_customer_wallet'


export default class OrderSavePaymentSourceToCustomerWallet extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(OrderSavePaymentSourceToCustomerWallet)

		const res = await exec('orders', args.id, TRIGGER, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
