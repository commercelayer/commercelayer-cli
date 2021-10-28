import Command from '../../base'
import exec from '../../exec'
import { validActions } from './actions'


const TRIGGER = 'save_billing_address_to_customer_address_book'


export default class OrdersSaveBillingAddressToCustomerAddressBook extends Command {

	static description = validActions[TRIGGER]

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {
    const { args, flags } = this.parse(OrdersSaveBillingAddressToCustomerAddressBook)
		return exec(args.id, TRIGGER, flags)
	}

}
