import Command from '../../base'
import exec from '../../exec'
import { validActions } from './actions'


const TRIGGER = 'save_payment_source_to_customer_wallet'


export default class OrdersSavePaymentSourceToCustomerWallet extends Command {

	static description = validActions[TRIGGER]

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(OrdersSavePaymentSourceToCustomerWallet)

		const res = await exec(args.id, TRIGGER, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
