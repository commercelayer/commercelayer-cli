import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/returns'


const TRIGGER = 'unarchive'


export default class ReturnUnarchive extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(ReturnUnarchive)

		const res = await exec('returns', args.id, TRIGGER, flags)

    this.successMessage('return', TRIGGER, res.id)

    return res

	}

}
