import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/webhooks'


const TRIGGER = 'reset_circuit'


export default class WebhookResetCircuit extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = this.parse(WebhookResetCircuit)

		const res = await exec('webhooks', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('webhook', TRIGGER, res.id)

    return res

	}

}
