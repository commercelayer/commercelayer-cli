import type { ShippingMethod } from '@commercelayer/sdk'
import Command from '../../base'
import { triggers } from '../../triggers/shipping_methods'


const TRIGGER = 'remove_tags'


export default class ShippingMethodRemoveTags extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(ShippingMethodRemoveTags)

		const res = await this.executeAction<ShippingMethod>('shipping_methods', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('shipping_method', TRIGGER, res.id)

    return res

	}

}
