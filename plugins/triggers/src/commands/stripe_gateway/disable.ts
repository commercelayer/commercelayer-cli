import type { StripeGateway } from '@commercelayer/sdk'
import Command from '../../base'
import { triggers } from '../../triggers/stripe_gateways'


const TRIGGER = 'disable'


export default class StripeGatewayDisable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(StripeGatewayDisable)

		const res = await this.executeAction<StripeGateway>('stripe_gateways', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('stripe_gateway', TRIGGER, res.id)

    return res

	}

}
