import Command from '../../base'
import exec from '../../exec'
import { validActions } from './actions'


const TRIGGER = '##__ACTION_ID__##'


export default class Orders##__ACTION_NAME__## extends Command {

	static description = validActions[TRIGGER]

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {
    const { args, flags } = this.parse(Orders##__ACTION_NAME__##)
		return exec(args.id, TRIGGER, flags)
	}

}
