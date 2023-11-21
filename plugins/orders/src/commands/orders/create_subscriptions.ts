import Command from '../../base'
import { triggers } from '../../triggers'


const TRIGGER = 'create_subscriptions'


export default class OrdersCreateSubscriptions extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(OrdersCreateSubscriptions)

		const res = await this.executeAction(args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
