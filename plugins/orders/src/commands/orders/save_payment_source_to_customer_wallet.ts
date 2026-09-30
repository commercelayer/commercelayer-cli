import Command from '../../base'
import { triggers } from '../../triggers'


const TRIGGER = 'save_payment_source_to_customer_wallet'


export default class OrdersSavePaymentSourceToCustomerWallet extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(OrdersSavePaymentSourceToCustomerWallet)

		const res = await this.executeAction(args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
