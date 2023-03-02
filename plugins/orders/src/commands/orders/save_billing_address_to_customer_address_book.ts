import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers'


const TRIGGER = 'save_billing_address_to_customer_address_book'


export default class OrdersSaveBillingAddressToCustomerAddressBook extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(OrdersSaveBillingAddressToCustomerAddressBook)

		const res = await exec(args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
