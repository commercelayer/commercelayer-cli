import Command from '../../base'
import { triggers } from '../../triggers/bundles'
import { type Bundle } from '@commercelayer/sdk'


const TRIGGER = 'remove_tags'


export default class BundleRemoveTags extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(BundleRemoveTags)

		const res = await this.executeAction<Bundle>('bundles', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('bundle', TRIGGER, res.id)

    return res

	}

}
