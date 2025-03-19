import Command from '../../base'
import { triggers } from '../../triggers/coupons'
import { type Coupon } from '@commercelayer/sdk'


const TRIGGER = 'add_tags'


export default class CouponAddTags extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(CouponAddTags)

		const res = await this.executeAction<Coupon>('coupons', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('coupon', TRIGGER, res.id)

    return res

	}

}
