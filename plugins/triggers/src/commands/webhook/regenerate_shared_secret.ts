import type { Webhook } from '@commercelayer/sdk'
import Command from '../../base'
import { triggers } from '../../triggers/webhooks'


const TRIGGER = 'regenerate_shared_secret'


export default class WebhookRegenerateSharedSecret extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(WebhookRegenerateSharedSecret)

		const res = await this.executeAction<Webhook>('webhooks', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('webhook', TRIGGER, res.id)

    return res

	}

}
