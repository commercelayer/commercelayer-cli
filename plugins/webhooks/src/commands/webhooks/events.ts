import Command, { Flags, CliUx } from '../../base'
import Table, { HorizontalAlignment, VerticalAlignment } from 'cli-table3'
import { clConfig, clOutput, clColor } from '@commercelayer/cli-core'
import { responseCodeColor } from './event'
import { EventCallback, QueryParamsList } from '@commercelayer/sdk'


const MAX_EVENTS = 1000

export default class WebhooksEvents extends Command {

	static description = 'list all the events associated to the webhook'

	static aliases = ['wh:events']

	static examples = [
		'$ commercelayer webhooks:events <webhook-id>',
		'$ cl wh:events <webhook-id>',
	]

	static flags = {
		...Command.flags,
		all: Flags.boolean({
			char: 'A',
			description: `show all events instead of first ${clConfig.api.page_max_size} only `,
			exclusive: ['limit'],
		}),
		limit: Flags.integer({
			char: 'l',
			description: 'limit number of events in output',
			exclusive: ['all'],
		}),
	}

	static args = [
		{ name: 'id', description: 'unique id of the webhook', required: true, hidden: false },
	]


	async run() {

		const { args, flags } = await this.parse(WebhooksEvents)

		if (flags.limit && (flags.limit < 1)) this.error(clColor.italic('Limit') + ' must be a positive integer')

		const id = args.id

		const cl = this.commercelayerInit(flags)


		try {

			let pageSize = clConfig.api.page_max_size
			const tableData = []
			let currentPage = 0
			let pageCount = 1
			let itemCount = 0
			let totalItems = 1

			if (flags.limit) pageSize = Math.min(flags.limit, pageSize)

			CliUx.ux.action.start('Fetching events')
			while (currentPage < pageCount) {

				const params: QueryParamsList = {
					pageSize,
					pageNumber: ++currentPage,
					sort: ['-created_at'],
					filters: {
						webhook_id_eq: id,
					},
				}

				if (params && params.filters) {
					/*
				  if (flags.type) params.filters.resource_type_eq = flags.type
				  if (flags.group) params.filters.reference_start = flags.group + '-'
				  if (flags.status) params.filters.status_eq = flags.status
				  if (flags.warnings) params.filters.warnings_count_gt = 0
				  if (flags.warnings) params.filters.errors_count_gt = 0
				  */
				}

				// eslint-disable-next-line no-await-in-loop
				const events = await cl.event_callbacks.list(params)

				if (events?.length) {
					tableData.push(...events)
					currentPage = events.meta.currentPage
					if (currentPage === 1) {
						pageCount = this.computeNumPages(flags, events.meta)
						totalItems = events.meta.recordCount
					}
					itemCount += events.length
				}

			}
			CliUx.ux.action.stop()

			this.log()

			if (tableData?.length) {
				const table = buildEventsTableData(tableData)
				this.log(table)
				this.footerMessage(flags, itemCount, totalItems)
			} else this.log(clColor.italic('No events found for webhook ' + clColor.api.resource(id)))

			this.log()

			return tableData

		} catch (error) {
			this.handleError(error, flags)
		}

	}


	private footerMessage(flags: any, itemCount: number, totalItems: number) {

		this.log()
		this.log(`Total displayed events: ${clColor.yellowBright(String(itemCount))}`)
		this.log(`Total event count: ${clColor.yellowBright(String(totalItems))}`)

		if (itemCount < totalItems) {
			if (flags.all || ((flags.limit || 0) > MAX_EVENTS)) {
				this.log()
				this.warn(`The maximum number of events that can be displayed is ${clColor.yellowBright(String(MAX_EVENTS))}`)
			} else
				if (!flags.limit) {
					this.log()
					const displayedMsg = `Only ${clColor.yellowBright(String(itemCount))} of ${clColor.yellowBright(String(totalItems))} records are displayed`
					if (totalItems < MAX_EVENTS) this.warn(`${displayedMsg}, to see all existing items run the command with the ${clColor.cli.flag('--all')} flag enabled`)
					else this.warn(`${displayedMsg}, to see more items (max ${MAX_EVENTS}) run the command with the ${clColor.cli.flag('--limit')} flag enabled`)
				}
		}

	}


	private computeNumPages(flags: any, meta: any): number {

		let numRecord = 25
		if (flags.all) numRecord = meta.recordCount
		else
			if (flags.limit) numRecord = flags.limit

		numRecord = Math.min(MAX_EVENTS, numRecord)
		const numPages = Math.ceil(numRecord / 25)

		return numPages

	}

}



const buildEventsTableData = (tableData: EventCallback[]): string => {

	const table = new Table({
		head: ['ID', 'Code', 'Response message', 'Created at'],
		colWidths: [12, 7, 46, 25],
		style: {
			head: ['brightYellow'],
			compact: false,
		},
		wordWrap: true,
	})

	// let index = 0
	table.push(...tableData.map(e => [
		// { content: ++index, hAlign: 'right' as HorizontalAlignment },
		{ content: clColor.table.key(e.id || ''), vAlign: 'center' as VerticalAlignment },
		{ content: responseCodeColor(e.response_code, e.response_message), hAlign: 'center' as HorizontalAlignment, vAlign: 'center' as VerticalAlignment },
		e.response_message || '',
		{ content: clOutput.localeDate(e.created_at), hAlign: 'center' as HorizontalAlignment, vAlign: 'center' as VerticalAlignment },
	]))

	return table.toString()

}


export { buildEventsTableData }
