import Command from '../../base'
import { triggers } from '../../triggers/bundles'
import { type Bundle } from '@commercelayer/sdk'


const TRIGGER = 'compute_price_amount'


export default class BundleComputePriceAmount extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(BundleComputePriceAmount)

		const res = await this.executeAction<Bundle>('bundles', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('bundle', TRIGGER, res.id)

    return res

	}

}
