import Command from '../../base'
import { triggers } from '../../triggers/buy_x_pay_y_promotions'
import { type BuyXPayYPromotion } from '@commercelayer/sdk'


const TRIGGER = 'remove_tags'


export default class BuyXPayYPromotionRemoveTags extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(BuyXPayYPromotionRemoveTags)

		const res = await this.executeAction<BuyXPayYPromotion>('buy_x_pay_y_promotions', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('buy_x_pay_y_promotion', TRIGGER, res.id)

    return res

	}

}
