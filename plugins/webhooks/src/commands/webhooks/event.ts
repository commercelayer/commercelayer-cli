import Command, { flags } from '../../base'
import chalk from 'chalk'
import Table from 'cli-table3'
import { output } from '@commercelayer/cli-core'
import { EventCallback } from '@commercelayer/sdk'


export default class WebhooksEvent extends Command {

	static description = 'show the details of a firedf webhook event'

	static aliases = ['wh:event', 'webhook:event']

	static examples = [
		'$ commercelayer webhooks:event <event-id>',
		'$ cl webhooks:event <event-id> -p',
	]

	static flags = {
		...Command.flags,
		payload: flags.boolean({
			char: 'p',
			description: 'show the event payload sent to the callback endpoint',
		}),
		format: flags.boolean({
			char: 'f',
			description: 'format the payload output',
			dependsOn: ['payload'],
		}),
	}

	static args = [
		{ name: 'id', description: 'unique id of the webhook event', required: true, hidden: false },
	]

	async run() {

		const { args, flags } = this.parse(WebhooksEvent)

		const id = args.id

		const cl = this.commercelayerInit(flags)


		try {

			// const event = await cl.event_callbacks.retrieve(id)
			const events = await cl.event_callbacks.list({ filters: { id_eq: id } })
			if (!events || (events.length === 0)) {
				this.log(`Event with id ${chalk.yellowBright(id)} not found`)
				return
			}
			const event = events[0]

			const table = new Table({
				// head: ['ID', 'Topic', 'Circuit state', 'Failures'],
				colWidths: [23, 67],
				wordWrap: true,
			})


			// let index = 0
			table.push(...Object.entries(event)
				.filter(([k]) => !['type', 'payload'].includes(k))
				.map(([k, v]) => {
					return [
						{ content: chalk.blueBright(k), hAlign: 'right', vAlign: 'center' },
						formatValue(k, v, event),
					]
				}))

			this.log()
			this.log(table.toString())


			if (flags.payload) {

				this.log()

				if (event.payload) {

					const hSuffix = flags.format ? 'formatted object' : 'raw JSON'

					const t = new Table({
						colWidths: [91],
						head: [`EVENT CALLBACK PAYLOAD  ${chalk.italic(`(${hSuffix} payload)`)}`],
						style: { head: ['brightBlue'] },
						wordWrap: true,
					})

					const payloadObject = (typeof event.payload === 'object') ? event.payload : JSON.parse(event.payload as unknown as string)
					t.push([ flags.format ? output.printObject(payloadObject) : JSON.stringify(payloadObject, null, 2) ])
					this.log(t.toString())

				} else this.log(chalk.italic('No payload associated to this event'))

			}

			this.log()


			return event

		} catch (error) {
			this.handleError(error, flags)
		}


	}
}



const formatValue = (field: string, value: string, obj?: EventCallback): any => {

	if (field.endsWith('_date') || field.endsWith('_at')) return output.localeDate(value)

	switch (field) {
		case 'id': return chalk.bold(value)
		case 'response_code': return responseCodeColor(value, obj?.response_message)
		default: {
			if ((typeof value === 'object') && (value !== null)) return JSON.stringify(value, undefined, 4)
			return String(value)
		}

	}

}


const responseCodeColor = (code?: string, message?: string): string => {

	let styled = code || ''

	if (code) {
		if (!Number.isNaN(code)) {
			const c = Number(code)
			if (c < 300) styled = chalk.greenBright(code)
			else styled = chalk.redBright(code)
		} else
			if (message) {
				const msg = message.toLowerCase()
				if (msg.includes('error') || msg.includes('failed')) styled = chalk.redBright(code)
			}
	}

	return styled

}


export { responseCodeColor }
