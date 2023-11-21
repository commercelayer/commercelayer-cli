import Command from '../../base'
import { triggers } from '../../triggers/markets'
import { type Market } from '@commercelayer/sdk'


const TRIGGER = 'disable'


export default class MarketDisable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(MarketDisable)

		const res = await this.executeAction<Market>('markets', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('market', TRIGGER, res.id)

    return res

	}

}
