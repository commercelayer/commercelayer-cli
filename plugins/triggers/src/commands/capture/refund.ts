import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/captures'


const TRIGGER = 'refund'


export default class CaptureRefund extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(CaptureRefund)

		const res = await exec('captures', args.id, TRIGGER, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
