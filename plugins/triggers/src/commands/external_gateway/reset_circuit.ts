import Command from '../../base'
import { triggers } from '../../triggers/external_gateways'
import { type ExternalGateway } from '@commercelayer/sdk'


const TRIGGER = 'reset_circuit'


export default class ExternalGatewayResetCircuit extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(ExternalGatewayResetCircuit)

		const res = await this.executeAction<ExternalGateway>('external_gateways', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('external_gateway', TRIGGER, res.id)

    return res

	}

}
