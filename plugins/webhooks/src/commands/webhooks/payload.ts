import Command, { flags } from '../../base'
import chalk from 'chalk'
import { output } from '@commercelayer/cli-core'



export default class WebhooksPayload extends Command {

	static description = 'show the payload associated to an event callback'

	static aliases = ['wh:payload', 'webhook:payload']

	static examples = [
		'$ commercelayer webhooks:payload <event-id>',
		'$ cl webhook:payload <event-id>',
		'$ cl wh:payload <event-id> -f',
	]

	static flags = {
		...Command.flags,
		format: flags.boolean({
			char: 'f',
			description: 'format the payload output',
		}),
	}

	static args = [
		{ name: 'id', description: 'unique id of the webhook event', required: true, hidden: false },
	]


	async run() {

		const { args, flags } = this.parse(WebhooksPayload)

		const id = args.id

		const cl = this.commercelayerInit(flags)


		try {

			const events = await cl.event_callbacks.list({ filters: { id_eq: id } })
			if (!events || (events.length === 0)) {
				this.log(`Event with id ${chalk.yellowBright(id)} not found`)
				return
			}
			const event = events[0]

			if (event.payload) {
        const payload = JSON.parse((typeof event.payload === 'string') ? event.payload : String(event.payload))
        this.log(flags.format ? output.printObject(payload) : JSON.stringify(payload, null, 4))
      }

			return event

		} catch (error) {
			this.handleError(error, flags)
		}

	}

}
