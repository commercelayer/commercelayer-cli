import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/free_gift_promotions'


const TRIGGER = 'disable'


export default class FreeGiftPromotionDisable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(FreeGiftPromotionDisable)

		const res = await exec('free_gift_promotions', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('free_gift_promotion', TRIGGER, res.id)

    return res

	}

}
