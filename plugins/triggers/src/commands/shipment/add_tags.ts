import Command from '../../base'
import { triggers } from '../../triggers/shipments'
import { type Shipment } from '@commercelayer/sdk'


const TRIGGER = 'add_tags'


export default class ShipmentAddTags extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(ShipmentAddTags)

		const res = await this.executeAction<Shipment>('shipments', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('shipment', TRIGGER, res.id)

    return res

	}

}
