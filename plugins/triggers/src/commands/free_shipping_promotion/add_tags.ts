import Command from '../../base'
import { triggers } from '../../triggers/free_shipping_promotions'
import { type FreeShippingPromotion } from '@commercelayer/sdk'


const TRIGGER = 'add_tags'


export default class FreeShippingPromotionAddTags extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(FreeShippingPromotionAddTags)

		const res = await this.executeAction<FreeShippingPromotion>('free_shipping_promotions', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('free_shipping_promotion', TRIGGER, res.id)

    return res

	}

}
