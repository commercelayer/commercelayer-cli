import Command from '../../base'
import { triggers } from '../../triggers/checkout_com_payments'
import { type CheckoutComPayment } from '@commercelayer/sdk'


const TRIGGER = 'details'


export default class CheckoutComPaymentDetails extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(CheckoutComPaymentDetails)

		const res = await this.executeAction<CheckoutComPayment>('checkout_com_payments', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('checkout_com_payment', TRIGGER, res.id)

    return res

	}

}
