import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/orders'


const TRIGGER = 'authorization_amount_cents'


export default class OrderAuthorizationAmountCents extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(OrderAuthorizationAmountCents)

		const res = await exec('orders', args.id, TRIGGER, flags)

    this.successMessage('order', TRIGGER, res.id)

    return res

	}

}
