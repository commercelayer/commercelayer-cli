import Command from '../../base'
import { triggers } from '../../triggers/captures'
import { type Capture } from '@commercelayer/sdk'


const TRIGGER = 'cancel'


export default class CaptureCancel extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(CaptureCancel)

		const res = await this.executeAction<Capture>('captures', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('capture', TRIGGER, res.id)

    return res

	}

}
