import Command from '../../base'
import { triggers } from '../../triggers/bundles'
import { type Bundle } from '@commercelayer/sdk'


const TRIGGER = 'compute_compare_at_amount'


export default class BundleComputeCompareAtAmount extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(BundleComputeCompareAtAmount)

		const res = await this.executeAction<Bundle>('bundles', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('bundle', TRIGGER, res.id)

    return res

	}

}
