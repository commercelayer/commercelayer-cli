import Command from '../../base'
import { triggers } from '../../triggers/authorizations'
import { type Authorization } from '@commercelayer/sdk'


const TRIGGER = 'capture_amount_cents'


export default class AuthorizationCaptureAmountCents extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(AuthorizationCaptureAmountCents)

		const res = await this.executeAction<Authorization>('authorizations', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('authorization', TRIGGER, res.id)

    return res

	}

}
