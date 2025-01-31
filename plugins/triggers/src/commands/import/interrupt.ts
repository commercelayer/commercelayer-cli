import Command from '../../base'
import { triggers } from '../../triggers/imports'
import { type Import } from '@commercelayer/sdk'


const TRIGGER = 'interrupt'


export default class ImportInterrupt extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(ImportInterrupt)

		const res = await this.executeAction<Import>('imports', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('import', TRIGGER, res.id)

    return res

	}

}
