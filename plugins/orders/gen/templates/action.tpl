import Command##__FLAGS_IMPORT__## from '../../base'
import { triggers } from '../../triggers'


const TRIGGER = '##__ACTION_ID__##'


export default class Orders##__ACTION_NAME__## extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		##__FLAG_VALUE__##
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(Orders##__ACTION_NAME__##)

		const res = await this.executeAction(args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
