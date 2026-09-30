import type { SatispayGateway } from '@commercelayer/sdk'
import Command from '../../base'
import { triggers } from '../../triggers/satispay_gateways'


const TRIGGER = 'enable'


export default class SatispayGatewayEnable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(SatispayGatewayEnable)

		const res = await this.executeAction<SatispayGateway>('satispay_gateways', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('satispay_gateway', TRIGGER, res.id)

    return res

	}

}
