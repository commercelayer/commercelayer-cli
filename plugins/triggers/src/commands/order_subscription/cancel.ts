import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/order_subscriptions'


const TRIGGER = 'cancel'


export default class OrderSubscriptionCancel extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(OrderSubscriptionCancel)

		const res = await exec('order_subscriptions', args.id, TRIGGER, flags)

    this.successMessage('order subscription', TRIGGER, res.id)

    return res

	}

}
