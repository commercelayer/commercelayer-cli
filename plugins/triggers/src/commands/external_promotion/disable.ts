import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/external_promotions'


const TRIGGER = 'disable'


export default class ExternalPromotionDisable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(ExternalPromotionDisable)

		const res = await exec('external_promotions', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('external_promotion', TRIGGER, res.id)

    return res

	}

}
