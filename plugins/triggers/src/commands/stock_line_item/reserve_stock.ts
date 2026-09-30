import type { StockLineItem } from '@commercelayer/sdk'
import Command from '../../base'
import { triggers } from '../../triggers/stock_line_items'


const TRIGGER = 'reserve_stock'


export default class StockLineItemReserveStock extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(StockLineItemReserveStock)

		const res = await this.executeAction<StockLineItem>('stock_line_items', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('stock_line_item', TRIGGER, res.id)

    return res

	}

}
