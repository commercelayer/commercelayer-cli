import Command from '../../base'
import exec from '../../exec'
import { validActions } from './actions'


const TRIGGER = 'cancel'


export default class OrdersCancel extends Command {

	static description = validActions[TRIGGER]

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(OrdersCancel)

		const res = await exec(args.id, TRIGGER, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
