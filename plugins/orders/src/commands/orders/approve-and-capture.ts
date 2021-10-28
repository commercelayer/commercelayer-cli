import Command from '../../base'
import exec from '../../exec'
import { validActions } from './actions'


const TRIGGER = 'approve_and_capture'


export default class OrdersApproveAndCapture extends Command {

	static description = validActions[TRIGGER]

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {
    const { args, flags } = this.parse(OrdersApproveAndCapture)
		return exec(args.id, TRIGGER, flags)
	}

}
