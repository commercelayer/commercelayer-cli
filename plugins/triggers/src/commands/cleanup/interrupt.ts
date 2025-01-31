import Command from '../../base'
import { triggers } from '../../triggers/cleanups'
import { type Cleanup } from '@commercelayer/sdk'


const TRIGGER = 'interrupt'


export default class CleanupInterrupt extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(CleanupInterrupt)

		const res = await this.executeAction<Cleanup>('cleanups', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('cleanup', TRIGGER, res.id)

    return res

	}

}
