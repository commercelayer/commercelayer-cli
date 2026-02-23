import Command from '../../base'
import { triggers } from '../../triggers/klarna_gateways'
import { type KlarnaGateway } from '@commercelayer/sdk'


const TRIGGER = 'enable'


export default class KlarnaGatewayEnable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(KlarnaGatewayEnable)

		const res = await this.executeAction<KlarnaGateway>('klarna_gateways', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('klarna_gateway', TRIGGER, res.id)

    return res

	}

}
