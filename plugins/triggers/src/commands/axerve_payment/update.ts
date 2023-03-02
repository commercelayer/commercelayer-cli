import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/axerve_payments'


const TRIGGER = 'update'


export default class AxervePaymentUpdate extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(AxervePaymentUpdate)

		const res = await exec('axerve_payments', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('axerve_payment', TRIGGER, res.id)

    return res

	}

}
