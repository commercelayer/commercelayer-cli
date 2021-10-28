import Command from '../../base'
import exec from '../../exec'
import { validActions } from './actions'


const TRIGGER = 'update_taxes'


export default class OrdersUpdateTaxes extends Command {

	static description = validActions[TRIGGER]

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {
    const { args, flags } = this.parse(OrdersUpdateTaxes)
		return exec(args.id, TRIGGER, flags)
	}

}
