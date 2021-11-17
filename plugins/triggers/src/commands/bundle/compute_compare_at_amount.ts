import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/bundles'


const TRIGGER = 'compute_compare_at_amount'


export default class BundleComputeCompareAtAmount extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(BundleComputeCompareAtAmount)

		const res = await exec('bundles', args.id, TRIGGER, flags)

    this.successMessage('bundle', TRIGGER, res.id)

    return res

	}

}
