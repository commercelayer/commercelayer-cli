import Command from '../../base'
import { triggers } from '../../triggers/payment_methods'
import { type PaymentMethod } from '@commercelayer/sdk'


const TRIGGER = 'disable'


export default class PaymentMethodDisable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(PaymentMethodDisable)

		const res = await this.executeAction<PaymentMethod>('payment_methods', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('payment_method', TRIGGER, res.id)

    return res

	}

}
