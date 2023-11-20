import Command from '../../base'
import { triggers } from '../../triggers/in_stock_subscriptions'
import { type InStockSubscription } from '@commercelayer/sdk'


const TRIGGER = 'deactivate'


export default class InStockSubscriptionDeactivate extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(InStockSubscriptionDeactivate)

		const res = await this.executeAction<InStockSubscription>('in_stock_subscriptions', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('in_stock_subscription', TRIGGER, res.id)

    return res

	}

}
