import type { Market } from '@commercelayer/sdk'
import Command from '../../base'
import { triggers } from '../../triggers/markets'


const TRIGGER = 'regenerate_shared_secret'


export default class MarketRegenerateSharedSecret extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(MarketRegenerateSharedSecret)

		const res = await this.executeAction<Market>('markets', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('market', TRIGGER, res.id)

    return res

	}

}
