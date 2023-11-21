import Command, { Flags } from '../../base'
import { triggers } from '../../triggers'


const TRIGGER = 'billing_address_clone_id'


export default class OrdersBillingAddressCloneId extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		value: Flags.string({
      char: 'v',
      description: 'the trigger attribute value',
      multiple: false,
      required: true,
    }),
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(OrdersBillingAddressCloneId)

		const res = await this.executeAction(args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
