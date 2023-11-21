import Command from '../../base'
import { triggers } from '../../triggers/fixed_price_promotions'
import { type FixedPricePromotion } from '@commercelayer/sdk'


const TRIGGER = 'disable'


export default class FixedPricePromotionDisable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(FixedPricePromotionDisable)

		const res = await this.executeAction<FixedPricePromotion>('fixed_price_promotions', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('fixed_price_promotion', TRIGGER, res.id)

    return res

	}

}
