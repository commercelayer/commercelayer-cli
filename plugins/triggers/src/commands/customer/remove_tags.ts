import Command from '../../base'
import { triggers } from '../../triggers/customers'
import { type Customer } from '@commercelayer/sdk'


const TRIGGER = 'remove_tags'


export default class CustomerRemoveTags extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(CustomerRemoveTags)

		const res = await this.executeAction<Customer>('customers', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('customer', TRIGGER, res.id)

    return res

	}

}
