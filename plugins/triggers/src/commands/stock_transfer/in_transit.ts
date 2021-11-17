import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/stock_transfers'


const TRIGGER = 'in_transit'


export default class StockTransferInTransit extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(StockTransferInTransit)

		const res = await exec('stock_transfers', args.id, TRIGGER, flags)

    this.successMessage('stock_transfer', TRIGGER, res.id)

    return res

	}

}
