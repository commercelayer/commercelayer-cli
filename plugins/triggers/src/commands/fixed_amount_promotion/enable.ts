import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/fixed_amount_promotions'


const TRIGGER = 'enable'


export default class FixedAmountPromotionEnable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(FixedAmountPromotionEnable)

		const res = await exec('fixed_amount_promotions', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('fixed_amount_promotion', TRIGGER, res.id)

    return res

	}

}
