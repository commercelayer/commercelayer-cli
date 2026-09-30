import type { PaypalPayment } from '@commercelayer/sdk'
import Command from '../../base'
import { triggers } from '../../triggers/paypal_payments'


const TRIGGER = 'refresh'


export default class PaypalPaymentRefresh extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(PaypalPaymentRefresh)

		const res = await this.executeAction<PaypalPayment>('paypal_payments', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('paypal_payment', TRIGGER, res.id)

    return res

	}

}
