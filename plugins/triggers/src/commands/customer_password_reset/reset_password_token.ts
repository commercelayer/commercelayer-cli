import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/customer_password_resets'


const TRIGGER = 'reset_password_token'


export default class CustomerPasswordResetResetPasswordToken extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(CustomerPasswordResetResetPasswordToken)

		const res = await exec('customer_password_resets', args.id, TRIGGER, flags)

    this.successMessage(TRIGGER, res.id)

    return res

	}

}
