import Command##__FLAGS_IMPORT__## from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers'


const TRIGGER = '##__ACTION_ID__##'


export default class Orders##__ACTION_NAME__## extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,##__FLAG_VALUE__##
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(Orders##__ACTION_NAME__##)

		const res = await exec(args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
