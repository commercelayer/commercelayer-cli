import Command from '../../base'
import { triggers } from '../../triggers/stripe_payments'
import { type StripePayment } from '@commercelayer/sdk'


const TRIGGER = 'update'


export default class StripePaymentUpdate extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(StripePaymentUpdate)

		const res = await this.executeAction<StripePayment>('stripe_payments', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('stripe_payment', TRIGGER, res.id)

    return res

	}

}
