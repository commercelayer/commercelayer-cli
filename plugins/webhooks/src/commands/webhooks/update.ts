import { BaseIdCommand, Flags } from '../../base'
import { URL } from 'node:url'
import type { WebhookUpdate } from '@commercelayer/sdk'
import { clColor } from '@commercelayer/cli-core'
import type { CommandError } from '@oclif/core/lib/interfaces'


export default class WebhooksUpdate extends BaseIdCommand {

	static description = 'update an existing webhook'

	static aliases = ['wh:update']

	static examples = [
		'$ commercelayer webhooks:update -t customers.create -u https://callback.url.io',
		'$ cl wh:update -i customer_group'
	]

	static flags = {
		topic: Flags.string({
			char: 't',
			description: 'the identifier of the event that will trigger the webhook',
			required: false
		}),
		url: Flags.string({
			char: 'u',
			description: 'the callback URL used to POST data',
			required: false
		}),
		include: Flags.string({
			char: 'i',
			description: 'a comma separated list of related resources to be included',
			multiple: true
		}),
		name: Flags.string({
			char: 'n',
			description: 'the webhook short name',
			required: false
		})
	}


	static args = {
		...BaseIdCommand.args
  }


	async run(): Promise<any> {

		const { args, flags } = await this.parse(WebhooksUpdate)

		const id = args.id

		const cl = this.commercelayerInit(flags)

		/*
		if (!flags.topic && !flags.url && !flags.include) {
		  this.warn(`No updates defined for webhook ${chalk.bold(id)}`)
		  return
		}
		*/

		const name = flags.name
		const topic = flags.topic
		const url = flags.url ? new URL(flags.url).toString() : undefined

		let include: string[] | undefined
		if (flags.include) {
			const inc = flags.include.join(',')
			include = (inc === 'null') ? [] : inc.split(',')
		}


		try {

			const attributes: WebhookUpdate = { id }

			if (topic) attributes.topic = topic
			if (name) attributes.name = name
			if (url) attributes.callback_url = url
			if (include) attributes.include_resources = include

			const webhook = await cl.webhooks.update(attributes)

			this.log(`\n${clColor.msg.success('Successfully')} updated webhook with id ${clColor.api.id(webhook.id)}\n`)

			return webhook

		} catch (error) {
			this.handleError(error as CommandError, flags, id)
		}

	}

}
