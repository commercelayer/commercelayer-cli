import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/checkout_com_payments'


const TRIGGER = 'authorize'


export default class CheckoutComPaymentAuthorize extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(CheckoutComPaymentAuthorize)

		const res = await exec('checkout_com_payments', args.id, TRIGGER, flags)

    this.successMessage('checkout com payment', TRIGGER, res.id)

    return res

	}

}
