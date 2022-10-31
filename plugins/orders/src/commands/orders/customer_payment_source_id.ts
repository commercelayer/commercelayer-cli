import Command, { Flags } from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers'


const TRIGGER = 'customer_payment_source_id'


export default class OrdersCustomerPaymentSourceId extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
    value: Flags.string({
      char: 'v',
      description: 'the trigger attribute value',
      multiple: false,
      required: true,
    }),
	}

	static args = [
		...Command.args,
	]


	async run(): Promise<any> {

    const { args, flags } = await this.parse(OrdersCustomerPaymentSourceId)

		const res = await exec(args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
