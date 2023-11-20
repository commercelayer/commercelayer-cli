import Command from '../../base'
import { triggers } from '../../triggers/shipments'
import { type Shipment } from '@commercelayer/sdk'


const TRIGGER = 'decrement_stock'


export default class ShipmentDecrementStock extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(ShipmentDecrementStock)

		const res = await this.executeAction<Shipment>('shipments', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('shipment', TRIGGER, res.id)

    return res

	}

}
