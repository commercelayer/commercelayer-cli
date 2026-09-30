import type { AdyenGateway } from '@commercelayer/sdk'
import Command from '../../base'
import { triggers } from '../../triggers/adyen_gateways'


const TRIGGER = 'disable'


export default class AdyenGatewayDisable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(AdyenGatewayDisable)

		const res = await this.executeAction<AdyenGateway>('adyen_gateways', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('adyen_gateway', TRIGGER, res.id)

    return res

	}

}
