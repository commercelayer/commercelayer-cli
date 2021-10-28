import Command from '../../base'
import exec from '../../exec'
import { validActions } from './actions'


const TRIGGER = 'billing_address_same_as_shipping'


export default class OrdersBillingAddressSameAsShipping extends Command {

	static description = validActions[TRIGGER]

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {
    const { args, flags } = this.parse(OrdersBillingAddressSameAsShipping)
		return exec(args.id, TRIGGER, flags)
	}

}
