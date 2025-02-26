import Command from '../../base'
import { triggers } from '../../triggers/easypost_pickups'
import { type EasypostPickup } from '@commercelayer/sdk'


const TRIGGER = 'purchase'


export default class EasypostPickupPurchase extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(EasypostPickupPurchase)

		const res = await this.executeAction<EasypostPickup>('easypost_pickups', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('easypost_pickup', TRIGGER, res.id)

    return res

	}

}
