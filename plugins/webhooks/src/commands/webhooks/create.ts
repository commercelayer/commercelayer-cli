import Command, { flags } from '../../base'
import { URL } from 'url'
import chalk from 'chalk'


export default class WebhooksCreate extends Command {

	static description = 'create a new webhook'

	static aliases: ['wh:create', 'webhook:create']

	static examples = [
		'$ commercelayer webhooks:create -t customers.create -u https://callback.url.io',
		'$ cl wh:create -t orders.place -u http://myurl.com',
	]

	static flags = {
		...Command.flags,
		topic: flags.string({
			char: 't',
			description: 'the identifier of the event that will trigger the webhook',
			required: true,
		}),
		url: flags.string({
			char: 'u',
			description: 'the callback URL used to POST data',
			required: true,
		}),
		include: flags.string({
			char: 'i',
			description: 'a comma separated list of related resources to be included',
			multiple: true,
		}),
		name: flags.string({
			char: 'n',
			description: 'the webhook short name',
			default: '',	// TEMP: the sdk currently consider this field as mandatory
		}),
	}


	async run() {

		const { flags } = this.parse(WebhooksCreate)

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

			this.log(`\n${chalk.greenBright('Successfully')} created new webhook with topic ${chalk.bold(topic)} and id ${chalk.bold(webhook.id)}\n`)

			return webhook

		} catch (error) {
			this.handleError(error, flags)
		}

	}

}
