import Command from '../../base'
import exec from '../../exec'
import { validActions } from './actions'


const TRIGGER = 'save_shipping_address_to_customer_address_book'


export default class OrdersSaveShippingAddressToCustomerAddressBook extends Command {

	static description = validActions[TRIGGER]

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {
    const { args, flags } = this.parse(OrdersSaveShippingAddressToCustomerAddressBook)
		return exec(args.id, TRIGGER, flags)
	}

}
