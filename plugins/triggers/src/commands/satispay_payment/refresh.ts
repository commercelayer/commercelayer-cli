import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/satispay_payments'


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

		const res = await exec('satispay_payments', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('satispay_payment', TRIGGER, res.id)

    return res

	}

}
