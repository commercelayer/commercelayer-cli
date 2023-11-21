import Command from '../../base'
import { triggers } from '../../triggers/gift_cards'
import { type GiftCard } from '@commercelayer/sdk'


const TRIGGER = 'deactivate'


export default class GiftCardDeactivate extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(GiftCardDeactivate)

		const res = await this.executeAction<GiftCard>('gift_cards', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('gift_card', TRIGGER, res.id)

    return res

	}

}
