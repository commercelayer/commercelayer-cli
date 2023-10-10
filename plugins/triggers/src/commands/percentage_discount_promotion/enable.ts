import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/percentage_discount_promotions'


const TRIGGER = 'enable'


export default class PercentageDiscountPromotionEnable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(PercentageDiscountPromotionEnable)

		const res = await exec('percentage_discount_promotions', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('percentage_discount_promotion', TRIGGER, res.id)

    return res

	}

}
