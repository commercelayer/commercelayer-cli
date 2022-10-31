import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/shipping_methods'


const TRIGGER = 'disable'


export default class ShippingMethodDisable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run(): Promise<any> {

    const { args, flags } = await this.parse(ShippingMethodDisable)

		const res = await exec('shipping_methods', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('shipping_method', TRIGGER, res.id)

    return res

	}

}
