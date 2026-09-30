import type { CheckoutComGateway } from '@commercelayer/sdk'
import Command from '../../base'
import { triggers } from '../../triggers/checkout_com_gateways'


const TRIGGER = 'update_webhooks'


export default class CheckoutComGatewayUpdateWebhooks extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(CheckoutComGatewayUpdateWebhooks)

		const res = await this.executeAction<CheckoutComGateway>('checkout_com_gateways', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('checkout_com_gateway', TRIGGER, res.id)

    return res

	}

}
