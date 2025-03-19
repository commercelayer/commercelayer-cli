import Command from '../../base'
import { triggers } from '../../triggers/sku_options'
import { type SkuOption } from '@commercelayer/sdk'


const TRIGGER = 'add_tags'


export default class SkuOptionAddTags extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(SkuOptionAddTags)

		const res = await this.executeAction<SkuOption>('sku_options', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('sku_option', TRIGGER, res.id)

    return res

	}

}
