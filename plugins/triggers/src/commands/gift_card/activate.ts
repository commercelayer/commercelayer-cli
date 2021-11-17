import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/gift_cards'


const TRIGGER = 'activate'


export default class GiftCardActivate extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(GiftCardActivate)

		const res = await exec('gift_cards', args.id, TRIGGER, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
