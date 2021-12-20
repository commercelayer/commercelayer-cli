import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/authorizations'


const TRIGGER = 'capture'


export default class AuthorizationCapture extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(AuthorizationCapture)

		const res = await exec('authorizations', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('authorization', TRIGGER, res.id)

    return res

	}

}
