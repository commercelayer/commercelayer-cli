import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/in_stock_subscriptions'


const TRIGGER = 'activate'


export default class InStockSubscriptionActivate extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(InStockSubscriptionActivate)

		const res = await exec('in_stock_subscriptions', args.id, TRIGGER, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
