import Command, { flags } from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers'


const TRIGGER = 'billing_address_clone_id'


export default class OrdersBillingAddressCloneId extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
    value: flags.string({
      char: 'v',
      description: 'the trigger attribute value',
      multiple: false,
      required: true,
    }),
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(OrdersBillingAddressCloneId)

		const res = await exec(args.id, TRIGGER, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
