/* eslint-disable no-await-in-loop */
import Command, { flags } from '../../base'
import { util } from '@commercelayer/cli-core'
import { responseCodeColor } from './event'
import cliux from 'cli-ux'
import chalk from 'chalk'
import { EventCallback } from '@commercelayer/sdk'


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

		this.log(`Listening webhook ${chalk.yellowBright(id)}...`)
		cliux.action.start('Waiting for next event callback')

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
					for (const event of events) this.log(eventMessage(event))
					lastEvent = new Date(events[0].created_at)
					lastEvent.setMilliseconds(lastEvent.getMilliseconds() + 1)
				}

				await util.sleep(1000)
				elapsedWithoutEvents = Math.floor((Date.now() - lastEvent.getTime()) / 1000)

			}
			while (elapsedWithoutEvents < listenTime)

			cliux.action.stop('timed out')
			this.log(`\nNo events received in the last ${chalk.bold(String(listenTime))} seconds\n`)

		} catch (error) {
			if (cl.isApiError(error) && (error.status === 401)) this.error('The current access token has expired')
			else throw error
		}

	}

}


const eventMessage = (e: EventCallback): string => {
	const tstamp = e.created_at.replace('T', ' ').replace('Z', '')
	// const ok = (!Number.isNaN(e.response_code)) && (Number(e.response_code) < 300)
	const arrow = chalk.cyanBright('-->')
	const code = responseCodeColor(e.response_code, e.response_message)
	const msg = `${arrow}    ${tstamp}    ${e.id}    ${code}`
	return msg
}
