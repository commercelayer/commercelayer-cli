import Command from '../../base'
import { triggers } from '../../triggers/checkout_com_gateways'
import { type CheckoutComGateway } from '@commercelayer/sdk'


const TRIGGER = 'enable'


export default class CheckoutComGatewayEnable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(CheckoutComGatewayEnable)

		const res = await this.executeAction<CheckoutComGateway>('checkout_com_gateways', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('checkout_com_gateway', TRIGGER, res.id)

    return res

	}

}
