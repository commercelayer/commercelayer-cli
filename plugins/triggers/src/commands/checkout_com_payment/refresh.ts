import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/checkout_com_payments'


const TRIGGER = 'refresh'


export default class CheckoutComPaymentRefresh extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(CheckoutComPaymentRefresh)

		const res = await exec('checkout_com_payments', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('checkout_com_payment', TRIGGER, res.id)

    return res

	}

}
