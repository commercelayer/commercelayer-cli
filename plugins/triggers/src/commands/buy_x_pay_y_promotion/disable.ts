import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/buy_x_pay_y_promotions'


const TRIGGER = 'disable'


export default class BuyXPayYPromotionDisable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(BuyXPayYPromotionDisable)

		const res = await exec('buy_x_pay_y_promotions', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('buy_x_pay_y_promotion', TRIGGER, res.id)

    return res

	}

}
