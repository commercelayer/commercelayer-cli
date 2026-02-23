import Command from '../../base'
import { triggers } from '../../triggers/paypal_gateways'
import { type PaypalGateway } from '@commercelayer/sdk'


const TRIGGER = 'enable'


export default class PaypalGatewayEnable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(PaypalGatewayEnable)

		const res = await this.executeAction<PaypalGateway>('paypal_gateways', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('paypal_gateway', TRIGGER, res.id)

    return res

	}

}
