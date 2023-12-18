import Command from '../../base'
import { triggers } from '../../triggers/webhooks'
import { type Webhook } from '@commercelayer/sdk'


const TRIGGER = 'enable'


export default class WebhookEnable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(WebhookEnable)

		const res = await this.executeAction<Webhook>('webhooks', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('webhook', TRIGGER, res.id)

    return res

	}

}
