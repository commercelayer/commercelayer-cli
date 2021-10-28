import Command from '../../base'
import exec from '../../exec'
import { validActions } from './actions'


const TRIGGER = 'shipping_address_same_as_billing'


export default class OrdersShippingAddressSameAsBilling extends Command {

	static description = validActions[TRIGGER]

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {
    const { args, flags } = this.parse(OrdersShippingAddressSameAsBilling)
		return exec(args.id, TRIGGER, flags)
	}

}
