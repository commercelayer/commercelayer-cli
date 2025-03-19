import Command from '../../base'
import { triggers } from '../../triggers/addresses'
import { type Address } from '@commercelayer/sdk'


const TRIGGER = 'add_tags'


export default class AddressAddTags extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(AddressAddTags)

		const res = await this.executeAction<Address>('addresses', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('address', TRIGGER, res.id)

    return res

	}

}
