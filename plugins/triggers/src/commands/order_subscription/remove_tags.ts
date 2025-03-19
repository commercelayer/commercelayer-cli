import Command from '../../base'
import { triggers } from '../../triggers/order_subscriptions'
import { type OrderSubscription } from '@commercelayer/sdk'


const TRIGGER = 'remove_tags'


export default class OrderSubscriptionRemoveTags extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(OrderSubscriptionRemoveTags)

		const res = await this.executeAction<OrderSubscription>('order_subscriptions', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('order_subscription', TRIGGER, res.id)

    return res

	}

}
