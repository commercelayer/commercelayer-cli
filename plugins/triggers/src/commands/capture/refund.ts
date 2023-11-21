import Command from '../../base'
import { triggers } from '../../triggers/captures'
import { type Capture } from '@commercelayer/sdk'


const TRIGGER = 'refund'


export default class CaptureRefund extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(CaptureRefund)

		const res = await this.executeAction<Capture>('captures', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('capture', TRIGGER, res.id)

    return res

	}

}
