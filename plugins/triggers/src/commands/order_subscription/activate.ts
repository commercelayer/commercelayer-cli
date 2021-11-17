import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/order_subscriptions'


const TRIGGER = 'activate'


export default class OrderSubscriptionActivate extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(OrderSubscriptionActivate)

		const res = await exec('order_subscriptions', args.id, TRIGGER, flags)

    this.successMessage('order_subscription', TRIGGER, res.id)

    return res

	}

}
