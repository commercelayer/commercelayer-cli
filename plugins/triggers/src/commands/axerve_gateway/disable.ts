import type { AxerveGateway } from '@commercelayer/sdk'
import Command from '../../base'
import { triggers } from '../../triggers/axerve_gateways'


const TRIGGER = 'disable'


export default class AxerveGatewayDisable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(AxerveGatewayDisable)

		const res = await this.executeAction<AxerveGateway>('axerve_gateways', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('axerve_gateway', TRIGGER, res.id)

    return res

	}

}
