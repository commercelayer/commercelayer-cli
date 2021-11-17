import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/orders'


const TRIGGER = 'refund'


export default class OrderRefund extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(OrderRefund)

		const res = await exec('orders', args.id, TRIGGER, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
