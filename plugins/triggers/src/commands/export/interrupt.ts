import Command from '../../base'
import { triggers } from '../../triggers/exports'
import { type Export } from '@commercelayer/sdk'


const TRIGGER = 'interrupt'


export default class ExportInterrupt extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(ExportInterrupt)

		const res = await this.executeAction<Export>('exports', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('export', TRIGGER, res.id)

    return res

	}

}
