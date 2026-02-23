import Command from '../../base'
import { triggers } from '../../triggers/klarna_gateways'
import { type KlarnaGateway } from '@commercelayer/sdk'


const TRIGGER = 'disable'


export default class KlarnaGatewayDisable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(KlarnaGatewayDisable)

		const res = await this.executeAction<KlarnaGateway>('klarna_gateways', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('klarna_gateway', TRIGGER, res.id)

    return res

	}

}
