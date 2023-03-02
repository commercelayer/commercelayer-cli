import Command##__FLAGS_IMPORT__## from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/##__RESOURCE_TYPE__##'


const TRIGGER = '##__ACTION_ID__##'


export default class ##__RESOURCE_CLASS__####__ACTION_NAME__## extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		##__FLAG_VALUE__##
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(##__RESOURCE_CLASS__####__ACTION_NAME__##)

		const res = await exec('##__RESOURCE_TYPE__##', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('##__RESOURCE_NAME__##', TRIGGER, res.id)

    return res

	}

}
