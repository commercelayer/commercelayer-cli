import Command from '../../base'
import { triggers } from '../../triggers/skus'
import { type Sku } from '@commercelayer/sdk'


const TRIGGER = 'remove_tags'


export default class SkuRemoveTags extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(SkuRemoveTags)

		const res = await this.executeAction<Sku>('skus', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('sku', TRIGGER, res.id)

    return res

	}

}
