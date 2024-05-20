import Command from '../../base'
import { triggers } from '../../triggers/price_list_schedulers'
import { type PriceListScheduler } from '@commercelayer/sdk'


const TRIGGER = 'enable'


export default class PriceListSchedulerEnable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(PriceListSchedulerEnable)

		const res = await this.executeAction<PriceListScheduler>('price_list_schedulers', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('price_list_scheduler', TRIGGER, res.id)

    return res

	}

}
