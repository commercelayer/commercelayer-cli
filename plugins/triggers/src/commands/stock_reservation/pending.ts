import Command from '../../base'
import { triggers } from '../../triggers/stock_reservations'
import { type StockReservation } from '@commercelayer/sdk'


const TRIGGER = 'pending'


export default class StockReservationPending extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(StockReservationPending)

		const res = await this.executeAction<StockReservation>('stock_reservations', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('stock_reservation', TRIGGER, res.id)

    return res

	}

}
