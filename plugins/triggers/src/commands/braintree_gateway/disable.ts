import type { BraintreeGateway } from '@commercelayer/sdk'
import Command from '../../base'
import { triggers } from '../../triggers/braintree_gateways'


const TRIGGER = 'disable'


export default class BraintreeGatewayDisable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(BraintreeGatewayDisable)

		const res = await this.executeAction<BraintreeGateway>('braintree_gateways', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('braintree_gateway', TRIGGER, res.id)

    return res

	}

}
