import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/authorizations'


const TRIGGER = 'void'


export default class AuthorizationVoid extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(AuthorizationVoid)

		const res = await exec('authorizations', args.id, TRIGGER, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
