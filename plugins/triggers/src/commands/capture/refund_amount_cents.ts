import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/captures'


const TRIGGER = 'refund_amount_cents'


export default class CaptureRefundAmountCents extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(CaptureRefundAmountCents)

		const res = await exec('captures', args.id, TRIGGER, flags)

    this.successMessage('capture', TRIGGER, res.id)

    return res

	}

}
