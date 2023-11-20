import Command from '../../base'
import { triggers } from '../../triggers/satispay_payments'
import { type SatispayPayment } from '@commercelayer/sdk'


const TRIGGER = 'refresh'


export default class SatispayPaymentRefresh extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(SatispayPaymentRefresh)

		const res = await this.executeAction<SatispayPayment>('satispay_payments', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('satispay_payment', TRIGGER, res.id)

    return res

	}

}
