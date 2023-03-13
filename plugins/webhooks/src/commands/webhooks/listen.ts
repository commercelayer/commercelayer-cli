/* eslint-disable no-await-in-loop */
import Command, { Flags, cliux } from '../../base'
import { clUtil, clColor, clOutput } from '@commercelayer/cli-core'
import { responseCodeColor } from './event'
import { EventCallback } from '@commercelayer/sdk'


const MAX_LISTEN_TIME = 60 * 2	// 2 minutes
const MIN_LISTEN_TIME = 5


export default class WebhooksListen extends Command {

	static description = 'listen a webhook for outgoing callbacks'

	static aliases = ['wh:listen']

	static examples = [
		'$ commercelayer webhooks:listen <webhook-id>',
		'$ cl wh:listen <webhook-id>',
	]

	static flags = {
		time: Flags.integer({
			char: 't',
			description: 'waiting time for the first event',
			required: false,
			default: MAX_LISTEN_TIME,
		}),
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

		const { args, flags } = await this.parse(WebhooksListen)

		const id = args.id
		const listenTime = Math.max(MIN_LISTEN_TIME, flags.time)

		const cl = this.commercelayerInit(flags)

		let lastEvent = new Date()
		let elapsedWithoutEvents = 0

		this.log(`Listening webhook ${clColor.api.id(id)}...`)
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

				await clUtil.sleep(1000)
				elapsedWithoutEvents = Math.floor((Date.now() - lastEvent.getTime()) / 1000)

			}
			while (elapsedWithoutEvents < listenTime)

			cliux.action.stop('timed out')
			this.log(`\nNo events received in the last ${clColor.bold(String(listenTime))} seconds\n`)

		} catch (error) {
			if (cl.isApiError(error) && [401, 404].includes(error.status || 0)) {
        if (error.status === 401) this.error('The current access token has expired')
        else
        if (error.status === 404) this.error(`Unable to find webhook${id ? ` with id ${clColor.msg.error(id)}` : ''}`)
      } else this.error(clOutput.formatError(error, flags))
		}

	}

}


const eventMessage = (e: EventCallback): string => {
	const tstamp = e.created_at.replace('T', ' ').replace('Z', '')
	// const ok = (!Number.isNaN(e.response_code)) && (Number(e.response_code) < 300)
	const arrow = clColor.cyanBright('-->')
	const code = responseCodeColor(e.response_code, e.response_message)
	const msg = `${arrow}    ${tstamp}    ${e.id}    ${code}`
	return msg
}
