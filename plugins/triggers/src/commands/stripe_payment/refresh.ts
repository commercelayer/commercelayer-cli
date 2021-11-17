import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/stripe_payments'


const TRIGGER = 'refresh'


export default class StripePaymentRefresh extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(StripePaymentRefresh)

		const res = await exec('stripe_payments', args.id, TRIGGER, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
