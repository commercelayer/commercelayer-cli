import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/orders'


const TRIGGER = 'billing_address_same_as_shipping'


export default class OrderBillingAddressSameAsShipping extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(OrderBillingAddressSameAsShipping)

		const res = await exec('orders', args.id, TRIGGER, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
