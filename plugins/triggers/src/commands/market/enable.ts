import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/markets'


const TRIGGER = 'enable'


export default class MarketEnable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run(): Promise<any> {

    const { args, flags } = await this.parse(MarketEnable)

		const res = await exec('markets', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('market', TRIGGER, res.id)

    return res

	}

}
