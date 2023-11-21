import Command from '../../base'
import { triggers } from '../../triggers/returns'
import { type Return } from '@commercelayer/sdk'


const TRIGGER = 'archive'


export default class ReturnArchive extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(ReturnArchive)

		const res = await this.executeAction<Return>('returns', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('return', TRIGGER, res.id)

    return res

	}

}
