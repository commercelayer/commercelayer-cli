import Command from '../../base'
import { triggers } from '../../triggers'


const TRIGGER = 'commit_invoice'


export default class OrdersCommitInvoice extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(OrdersCommitInvoice)

		const res = await this.executeAction(args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
