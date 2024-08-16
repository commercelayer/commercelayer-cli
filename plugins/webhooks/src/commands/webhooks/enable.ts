import { BaseIdCommand, Flags } from '../../base'
import { URL } from 'node:url'
import type { WebhookUpdate } from '@commercelayer/sdk'
import { clColor } from '@commercelayer/cli-core'
import type { CommandError } from '@oclif/core/lib/interfaces'


export default class WebhooksEnable extends BaseIdCommand {

	static description = 'enable a disabled webhook'

	static aliases = ['wh:enable']

	static examples = [
		'$ commercelayer webhooks:enable <webhook-id>',
		'$ cl wh:enable <webhook-id>'
	]

	static args = {
		...BaseIdCommand.args
  }


	async run(): Promise<any> {

		const { args, flags } = await this.parse(WebhooksEnable)

		const id = args.id

		const cl = this.commercelayerInit(flags)


		try {

			let webhook = await cl.webhooks.retrieve(id)
      if (!webhook) this.error(`Unable to find ${clColor.api.resource('webhook')} with ID ${clColor.msg.error(id)}`)

			webhook = await cl.webhooks.update({ id, _enable: true })

			this.log(`\n${clColor.msg.success('Successfully')} enabled webhook with id ${clColor.api.id(webhook.id)}\n`)

			return webhook

		} catch (error) {
			this.handleError(error as CommandError, flags, id)
		}

	}

}
