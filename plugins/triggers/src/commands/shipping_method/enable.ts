import Command from '../../base'
import { triggers } from '../../triggers/shipping_methods'
import { type ShippingMethod } from '@commercelayer/sdk'


const TRIGGER = 'enable'


export default class ShippingMethodEnable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(ShippingMethodEnable)

		const res = await this.executeAction<ShippingMethod>('shipping_methods', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('shipping_method', TRIGGER, res.id)

    return res

	}

}
