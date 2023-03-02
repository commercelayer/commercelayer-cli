import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/gift_cards'


const TRIGGER = 'balance_change_cents'


export default class GiftCardBalanceChangeCents extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(GiftCardBalanceChangeCents)

		const res = await exec('gift_cards', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('gift_card', TRIGGER, res.id)

    return res

	}

}
