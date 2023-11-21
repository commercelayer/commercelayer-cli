import Command from '../../base'
import { triggers } from '../../triggers/return_line_items'
import { type ReturnLineItem } from '@commercelayer/sdk'


const TRIGGER = 'restock'


export default class ReturnLineItemRestock extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(ReturnLineItemRestock)

		const res = await this.executeAction<ReturnLineItem>('return_line_items', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('return_line_item', TRIGGER, res.id)

    return res

	}

}
