import Command from '../../base'
import { triggers } from '../../triggers/flex_promotions'
import { type FlexPromotion } from '@commercelayer/sdk'


const TRIGGER = 'add_tags'


export default class FlexPromotionAddTags extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(FlexPromotionAddTags)

		const res = await this.executeAction<FlexPromotion>('flex_promotions', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('flex_promotion', TRIGGER, res.id)

    return res

	}

}
