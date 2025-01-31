import Command from '../../base'
import { triggers } from '../../triggers/vertex_accounts'
import { type VertexAccount } from '@commercelayer/sdk'


const TRIGGER = 'refresh_token'


export default class VertexAccountRefreshToken extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(VertexAccountRefreshToken)

		const res = await this.executeAction<VertexAccount>('vertex_accounts', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('vertex_account', TRIGGER, res.id)

    return res

	}

}
