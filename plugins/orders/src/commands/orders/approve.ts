import Command from '../../base'
import exec from '../../exec'
import { validActions } from './actions'


const TRIGGER = 'approve'


export default class OrdersApprove extends Command {

	static description = validActions[TRIGGER]

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {
    const { args, flags } = this.parse(OrdersApprove)
		return exec(args.id, TRIGGER, flags)
	}

}
