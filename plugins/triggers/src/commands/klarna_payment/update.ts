import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/klarna_payments'


const TRIGGER = 'update'


export default class KlarnaPaymentUpdate extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = await this.parse(KlarnaPaymentUpdate)

		const res = await exec('klarna_payments', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('klarna_payment', TRIGGER, res.id)

    return res

	}

}
