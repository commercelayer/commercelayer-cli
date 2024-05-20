import Command from '../../base'
import { triggers } from '../../triggers/price_list_schedulers'
import { type PriceListScheduler } from '@commercelayer/sdk'


const TRIGGER = 'disable'


export default class PriceListSchedulerDisable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(PriceListSchedulerDisable)

		const res = await this.executeAction<PriceListScheduler>('price_list_schedulers', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('price_list_scheduler', TRIGGER, res.id)

    return res

	}

}
