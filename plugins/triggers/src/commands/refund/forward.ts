import Command from '../../base'
import { triggers } from '../../triggers/refunds'
import { type Refund } from '@commercelayer/sdk'


const TRIGGER = 'forward'


export default class RefundForward extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(RefundForward)

		const res = await this.executeAction<Refund>('refunds', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('refund', TRIGGER, res.id)

    return res

	}

}
