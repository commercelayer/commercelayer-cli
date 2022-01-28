import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/adyen_payments'


const TRIGGER = 'details'


export default class AdyenPaymentDetails extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = await this.parse(AdyenPaymentDetails)

		const res = await exec('adyen_payments', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('adyen_payment', TRIGGER, res.id)

    return res

	}

}
