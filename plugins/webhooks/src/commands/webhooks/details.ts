import Command, { Flags } from '../../base'
import chalk from 'chalk'
import Table from 'cli-table3'
import _ from 'lodash'
import { clOutput } from '@commercelayer/cli-core'
import { QueryParamsRetrieve } from '@commercelayer/sdk'
import { buildEventsTableData } from './events'


export default class WebhooksDetails extends Command {

	static description = 'show the details of an existing webhook'

	static aliases = ['wh:details', 'webhook:details']

	static examples = [
		'$ commercelayer webhooks:details <webhook-id>',
		'$ cl webhooks:details <webhook-id> -H',
		'$ cl wh:details <webhook-id>',
	]

	static flags = {
		...Command.flags,
		'hide-empty': Flags.boolean({
			char: 'H',
			description: 'hide empty attributes',
		}),
		events: Flags.boolean({
			char: 'e',
			description: 'show the last event callbacks associated to the webhook',
		}),
	}

	static args = [
		{ name: 'id', description: 'unique id of the webhook', required: true, hidden: false },
	]


	async run() {

		const { args, flags } = await this.parse(WebhooksDetails)

		const id = args.id

		const cl = this.commercelayerInit(flags)


		try {

			const params: QueryParamsRetrieve = {}
			if (flags.events) params.include = [ 'last_event_callbacks' ]
			const webhook = await cl.webhooks.retrieve(id, params)

			const table = new Table({
				colWidths: [23, 67 + (flags.events ? 2 : 0)],
				wordWrap: true,
			})


			table.push(...Object.entries(webhook)
				.filter(([k]) => !['type', 'last_event_callbacks'].includes(k))
				.filter(([_k, v]) => !flags['hide-empty'] || !_.isEmpty(v) || (Array.isArray(v) && !(v.length === 0)))
				.map(([k, v]) => {
					return [
						{ content: chalk.blueBright(k), hAlign: 'right', vAlign: 'center' },
						formatValue(k, v),
					]
				}))

			this.log()
			this.log(table.toString())
			this.log()

			if (flags.events) {
				this.log(chalk.blueBright('LAST EVENT CALLBACKS:'))
				if (webhook.last_event_callbacks) {
					const table = buildEventsTableData(webhook.last_event_callbacks)
					this.log(table)
				} else this.log(chalk.italic('No event fired for this webhook'))
				this.log()
			}

			return webhook

		} catch (error) {
			this.handleError(error, flags)
		}

	}

}



const formatValue = (field: string, value: string): any => {

	if (field.endsWith('_date') || field.endsWith('_at')) return clOutput.localeDate(value)

	switch (field) {

		case 'id': return chalk.bold(value)
		case 'topic': return chalk.magentaBright(value)
		case 'circuit_state': return ((value === 'closed') ? chalk.greenBright : chalk.redBright)(value || '')
		case 'circuit_failure_count': return chalk.yellow(value || '')
		case 'include_resources': return String(value || '').replace(/,/g, ' | ')
		case 'metadata': {
			const t = new Table({ style: { compact: false } })
			t.push(...Object.entries(value).map(([k, v]) => {
				return [
					{ content: chalk.cyan.italic(k), hAlign: 'left', vAlign: 'center' },
					{ content: chalk.italic((typeof v === 'object') ? JSON.stringify(v) : v) } as any,
				]
			}))
			return t.toString()
		}
		default: {
			if ((typeof value === 'object') && (value !== null)) return JSON.stringify(value, undefined, 4)
			return String(value)
		}

	}

}
