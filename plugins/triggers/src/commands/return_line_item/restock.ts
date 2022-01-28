import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/return_line_items'


const TRIGGER = 'restock'


export default class ReturnLineItemRestock extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = await this.parse(ReturnLineItemRestock)

		const res = await exec('return_line_items', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('return_line_item', TRIGGER, res.id)

    return res

	}

}
