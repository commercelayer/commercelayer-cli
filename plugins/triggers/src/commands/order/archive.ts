import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/orders'


const TRIGGER = 'archive'


export default class OrderArchive extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(OrderArchive)

		const res = await exec('orders', args.id, TRIGGER, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
