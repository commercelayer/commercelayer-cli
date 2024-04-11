import Command from '../../base'
import { triggers } from '../../triggers/stock_items'
import { type StockItem } from '@commercelayer/sdk'


const TRIGGER = 'validate'


export default class StockItemValidate extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(StockItemValidate)

		const res = await this.executeAction<StockItem>('stock_items', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('stock_item', TRIGGER, res.id)

    return res

	}

}
