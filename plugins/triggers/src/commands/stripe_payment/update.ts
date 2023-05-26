import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/stripe_payments'


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

		const res = await exec('stripe_payments', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('stripe_payment', TRIGGER, res.id)

    return res

	}

}
