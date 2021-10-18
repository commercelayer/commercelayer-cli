/* eslint-disable no-await-in-loop */
import Command, { flags } from '../../base'
import { sleep } from '../../common'
import { responseCodeColor } from './event'
import cliux from 'cli-ux'
import chalk from 'chalk'


const MAX_LISTEN_TIME = 60 * 2	// 2 minutes
const MIN_LISTEN_TIME = 5


export default class WebhooksListen extends Command {

	static description = 'listen a webhook for outgoing callbacks'

	static aliases = ['wh:listen', 'webhook:listen']

	static examples = [
		'$ commercelayer webhooks:listen <webhook-id>',
		'$ cl wh:listen <webhook-id>',
	]

	static flags = {
		...Command.flags,
		time: flags.integer({
			char: 't',
			description: 'waiting time for the first event',
			required: false,
			default: MAX_LISTEN_TIME,
		}),
	}

	static args = [
		{ name: 'id', description: 'unique id of the webhook', required: true, hidden: false },
	]


	async run() {

		const { args, flags } = this.parse(WebhooksListen)

		const id = args.id
		const listenTime = Math.max(MIN_LISTEN_TIME, flags.time)

		const cl = this.commercelayerInit(flags)

		let lastEvent = new Date()
		let elapsedWithoutEvents = 0

		cliux.action.start('Listening webhook ' + chalk.yellowBright(id))

		try {

			do {

				const events = await cl.event_callbacks.list({
					filters: {
						webhook_id_eq: id,
						created_at_gt: lastEvent.toISOString(),
					},
					sort: ['-created_at'],
				})

				if (events.length > 0) {
					for (const event of events) {
						const tstamp = event.created_at.replace('T', ' ').replace('Z', '')
						this.log(`${chalk.cyanBright('-->')}    ${tstamp}    ${event.id}    ${responseCodeColor(event.response_code, event.response_message)}`)
					}
					lastEvent = new Date(events[0].created_at)
					lastEvent.setMilliseconds(lastEvent.getMilliseconds() + 1)
				}

				await sleep(1000)
				elapsedWithoutEvents = Math.floor((Date.now() - lastEvent.getTime()) / 1000)

			}
			while (elapsedWithoutEvents < listenTime)

			this.log(`\nNo events received in the last ${chalk.bold(String(listenTime))} seconds\n`)

		} catch (error) {
			if (cl.isApiError(error) && (error.status === 401)) this.error('The current access token has expired')
			else throw error
		}

	}

}
