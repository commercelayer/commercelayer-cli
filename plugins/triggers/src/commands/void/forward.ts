import Command from '../../base'
import { triggers } from '../../triggers/voids'
import { type Void } from '@commercelayer/sdk'


const TRIGGER = 'forward'


export default class VoidForward extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(VoidForward)

		const res = await this.executeAction<Void>('voids', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('void', TRIGGER, res.id)

    return res

	}

}
