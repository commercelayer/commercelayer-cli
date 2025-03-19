import Command from '../../base'
import { triggers } from '../../triggers/percentage_discount_promotions'
import { type PercentageDiscountPromotion } from '@commercelayer/sdk'


const TRIGGER = 'add_tags'


export default class PercentageDiscountPromotionAddTags extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(PercentageDiscountPromotionAddTags)

		const res = await this.executeAction<PercentageDiscountPromotion>('percentage_discount_promotions', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('percentage_discount_promotion', TRIGGER, res.id)

    return res

	}

}
