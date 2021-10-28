import Command from '../../base'
import exec from '../../exec'
import { validActions } from './actions'


const TRIGGER = 'unarchive'


export default class OrdersUnarchive extends Command {

	static description = validActions[TRIGGER]

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {
    const { args, flags } = this.parse(OrdersUnarchive)
		return exec(args.id, TRIGGER, flags)
	}

}
