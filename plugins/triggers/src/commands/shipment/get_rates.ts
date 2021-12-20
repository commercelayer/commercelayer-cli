import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/shipments'


const TRIGGER = 'get_rates'


export default class ShipmentGetRates extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(ShipmentGetRates)

		const res = await exec('shipments', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('shipment', TRIGGER, res.id)

    return res

	}

}
