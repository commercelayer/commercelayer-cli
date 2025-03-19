import Command from '../../base'
import { triggers } from '../../triggers/line_item_options'
import { type LineItemOption } from '@commercelayer/sdk'


const TRIGGER = 'remove_tags'


export default class LineItemOptionRemoveTags extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(LineItemOptionRemoveTags)

		const res = await this.executeAction<LineItemOption>('line_item_options', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('line_item_option', TRIGGER, res.id)

    return res

	}

}
