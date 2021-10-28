import Command from '../../base'
import exec from '../../exec'
import { validActions } from './actions'


const TRIGGER = 'authorize'


export default class OrdersAuthorize extends Command {

	static description = validActions[TRIGGER]

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {
    const { args, flags } = this.parse(OrdersAuthorize)
		return exec(args.id, TRIGGER, flags)
	}

}
