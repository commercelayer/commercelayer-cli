import Command, { Flags } from '../../base'
import Table from 'cli-table3'
import { clOutput, clColor } from '@commercelayer/cli-core'
import type { EventCallback } from '@commercelayer/sdk'
import type { CommandError } from '@oclif/core/lib/interfaces'


export default class WebhooksEvent extends Command {

	static description = 'show the details of a firedf webhook event'

	static aliases = ['wh:event']

	static examples = [
		'$ commercelayer webhooks:event <event-id>',
		'$ cl wh:event <event-id> -p',
	]

	static flags = {
		payload: Flags.boolean({
			char: 'p',
			description: 'show the event payload sent to the callback endpoint',
		}),
		format: Flags.boolean({
			char: 'f',
			description: 'format the payload output',
			dependsOn: ['payload'],
		}),
	}

	static args = {
    ...Command.args,
  }


	async run(): Promise<any> {

		const { args, flags } = await this.parse(WebhooksEvent)

		const id = args.id

		const cl = this.commercelayerInit(flags)


		try {

			// const event = await cl.event_callbacks.retrieve(id)
			const events = await cl.event_callbacks.list({ filters: { id_eq: id } })
			if (!events || (events.length === 0)) {
				this.log(`Event with id ${clColor.api.id(id)} not found`)
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
				.map(([k, v]: [string, string]) => {
					return [
						{ content: clColor.table.key(k), hAlign: 'right', vAlign: 'center' },
						formatValue(k, v, event),
					]
				}))

			this.log()
			this.log(table.toString())


			if (flags.payload) {

				this.log()

				if (event.payload) {

          this.log()
          const hSuffix = flags.format ? 'formatted object' : 'raw JSON'
          const header = clColor.blueBright(`EVENT CALLBACK PAYLOAD  ${clColor.italic(`(${hSuffix} payload)`)}`)
          this.log(header)
          this.log()

          /*
					const t = new Table({
						colWidths: [91],
						head: [`EVENT CALLBACK PAYLOAD  ${clColor.italic(`(${hSuffix} payload)`)}`],
						style: { head: ['brightBlue'] },
						wordWrap: false,
					})
          */

					const payloadObject = (typeof event.payload === 'object') ? event.payload : JSON.parse(event.payload as unknown as string)
          const tBody = flags.format ? clOutput.printObject(payloadObject) : JSON.stringify(payloadObject, null, 2)

          /*
					t.push([ tBody ])
					this.log(t.toString())
          */

          this.log(tBody)

				} else this.log(clColor.italic('No payload associated to this event'))

			}

			this.log()


			return event

		} catch (error) {
			this.handleError(error as CommandError, flags, id)
		}


	}
}



const formatValue = (field: string, value: string, obj?: EventCallback): any => {

	if (field.endsWith('_date') || field.endsWith('_at')) return clOutput.localeDate(value)

	switch (field) {
		case 'id': return clColor.api.id(value)
		case 'response_code': return responseCodeColor(value, obj?.response_message)
		default: {
			if ((typeof value === 'object') && (value !== null)) return JSON.stringify(value, undefined, 4)
			return String(value)
		}

	}

}


const responseCodeColor = (code?: string | null, message?: string | null): string => {

	let styled = code || ''

	if (code) {
		if (!Number.isNaN(code)) {
			const c = Number(code)
			styled = (c < 300) ? clColor.msg.success(code) : clColor.msg.error(code)
		} else
			if (message) {
				const msg = message.toLowerCase()
				if (msg.includes('error') || msg.includes('failed')) styled = clColor.msg.error(code)
			}
	}

	return styled

}


export { responseCodeColor }
