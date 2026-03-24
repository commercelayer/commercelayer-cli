import type { StockLineItem } from '@commercelayer/sdk'
import Command from '../../base'
import { triggers } from '../../triggers/stock_line_items'


const TRIGGER = 'decrement_stock'


export default class StockLineItemDecrementStock extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(StockLineItemDecrementStock)

		const res = await this.executeAction<StockLineItem>('stock_line_items', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('stock_line_item', TRIGGER, res.id)

    return res

	}

}
