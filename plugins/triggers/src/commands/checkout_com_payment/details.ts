import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/checkout_com_payments'


const TRIGGER = 'details'


export default class CheckoutComPaymentDetails extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run(): Promise<any> {

    const { args, flags } = await this.parse(CheckoutComPaymentDetails)

		const res = await exec('checkout_com_payments', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('checkout_com_payment', TRIGGER, res.id)

    return res

	}

}
