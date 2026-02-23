import Command from '../../base'
import { triggers } from '../../triggers/manual_gateways'
import { type ManualGateway } from '@commercelayer/sdk'


const TRIGGER = 'enable'


export default class ManualGatewayEnable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(ManualGatewayEnable)

		const res = await this.executeAction<ManualGateway>('manual_gateways', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('manual_gateway', TRIGGER, res.id)

    return res

	}

}
