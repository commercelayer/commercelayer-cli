import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/stock_transfers'


const TRIGGER = 'picking'


export default class StockTransferPicking extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(StockTransferPicking)

		const res = await exec('stock_transfers', args.id, TRIGGER, flags)

    this.successMessage('stock transfer', TRIGGER, res.id)

    return res

	}

}
