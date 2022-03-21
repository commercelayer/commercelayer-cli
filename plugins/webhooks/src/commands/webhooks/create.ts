import Command, { Flags } from '../../base'
import { URL } from 'url'
import { clColor } from '@commercelayer/cli-core'


export default class WebhooksCreate extends Command {

	static description = 'create a new webhook'

	static aliases = ['wh:create']

	static examples = [
		'$ commercelayer webhooks:create -t customers.create -u https://callback.url.io',
		'$ cl wh:create -t orders.place -u http://myurl.com',
	]

	static flags = {
		...Command.flags,
		topic: Flags.string({
			char: 't',
			description: 'the identifier of the event that will trigger the webhook',
			required: true,
		}),
		url: Flags.string({
			char: 'u',
			description: 'the callback URL used to POST data',
			required: true,
		}),
		include: Flags.string({
			char: 'i',
			description: 'a comma separated list of related resources to be included',
			multiple: true,
		}),
		name: Flags.string({
			char: 'n',
			description: 'the webhook short name',
			default: '',	// TEMP: the sdk currently consider this field as mandatory
		}),
	}

  static args = []


	async run() {

		const { flags } = await this.parse(WebhooksCreate)

		const cl = this.commercelayerInit(flags)

		const topic = flags.topic
		const url = new URL(flags.url).toString()
		const include = flags.include ? flags.include.join(',').split(',') : undefined
		const name = flags.name


		try {

			const webhook = await cl.webhooks.create({
				topic,
				name,
				callback_url: url,
				include_resources: include,
			})

			this.log(`\n${clColor.msg.success('Successfully')} created new webhook with topic ${clColor.bold(topic)} and id ${clColor.api.id(webhook.id)}\n`)

			return webhook

		} catch (error) {
			this.handleError(error, flags)
		}

	}

}
