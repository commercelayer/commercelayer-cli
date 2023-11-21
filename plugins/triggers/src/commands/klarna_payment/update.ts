import Command from '../../base'
import { triggers } from '../../triggers/klarna_payments'
import { type KlarnaPayment } from '@commercelayer/sdk'


const TRIGGER = 'update'


export default class KlarnaPaymentUpdate extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(KlarnaPaymentUpdate)

		const res = await this.executeAction<KlarnaPayment>('klarna_payments', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('klarna_payment', TRIGGER, res.id)

    return res

	}

}
