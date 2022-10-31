import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/stock_transfers'


const TRIGGER = 'complete'


export default class StockTransferComplete extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run(): Promise<any> {

    const { args, flags } = await this.parse(StockTransferComplete)

		const res = await exec('stock_transfers', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('stock_transfer', TRIGGER, res.id)

    return res

	}

}
