import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/payment_methods'


const TRIGGER = 'enable'


export default class PaymentMethodEnable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = await this.parse(PaymentMethodEnable)

		const res = await exec('payment_methods', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('payment_method', TRIGGER, res.id)

    return res

	}

}
