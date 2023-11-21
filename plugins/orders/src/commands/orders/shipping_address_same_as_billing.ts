import Command from '../../base'
import { triggers } from '../../triggers'


const TRIGGER = 'shipping_address_same_as_billing'


export default class OrdersShippingAddressSameAsBilling extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(OrdersShippingAddressSameAsBilling)

		const res = await this.executeAction(args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
