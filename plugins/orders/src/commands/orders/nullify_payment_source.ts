import Command from '../../base'
import { triggers } from '../../triggers'


const TRIGGER = 'nullify_payment_source'


export default class OrdersNullifyPaymentSource extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(OrdersNullifyPaymentSource)

		const res = await this.executeAction(args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
