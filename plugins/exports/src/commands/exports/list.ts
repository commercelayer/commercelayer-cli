import Command, { Flags } from '../../base'
import Table, { type HorizontalAlignment } from 'cli-table3'
import type { Export, QueryPageSize, QueryParamsList } from '@commercelayer/sdk'
import { clApi, clColor, clConfig, clOutput, clText, clUtil } from '@commercelayer/cli-core'
import type { CommandError } from '@oclif/core/lib/interfaces'
import * as cliux from '@commercelayer/cli-ux'


const MAX_EXPORTS = 1000

export default class ExportsList extends Command {

	static description = 'list all the created exports'

	static aliases = ['exp:list']

	static examples = [
		'$ commercelayer exports',
		'$ cl exports:list -A',
		'$ cl exp:list',
	]

	static flags = {
		all: Flags.boolean({
			char: 'A',
			description: `show all exports instead of first ${clConfig.api.page_max_size} only`,
			exclusive: ['limit'],
		}),
		type: Flags.string({
			char: 't',
			description: 'the type of resource exported',
			options: clConfig.exports.types as string[],
			multiple: false,
		}),
		status: Flags.string({
			char: 's',
			description: 'the export job status',
			options: clConfig.exports.statuses as string[],
			multiple: false,
		}),
		limit: Flags.integer({
			char: 'l',
			description: 'limit number of exports in output',
			exclusive: ['all'],
		}),
	}


	async run(): Promise<any> {

		const { flags } = await this.parse(ExportsList)

		if (flags.limit && (flags.limit < 1)) this.error(clColor.italic('Limit') + ' must be a positive integer')

		this.commercelayerInit(flags)


		try {

			let pageSize = clConfig.api.page_max_size as QueryPageSize
			const tableData = []
			let currentPage = 0
			let pageCount = 1
			let itemCount = 0
			let totalItems = 1

			if (flags.limit) pageSize = Math.min(flags.limit, pageSize) as QueryPageSize

			cliux.action.start('Fetching exports')
			let delay = 0
			while (currentPage < pageCount) {

				const params: QueryParamsList<Export> = {
					pageSize,
					pageNumber: ++currentPage,
					sort: ['-started_at'],
					filters: {},
				}

				if (params?.filters) {
					if (flags.type) params.filters.resource_type_eq = flags.type
					if (flags.status) params.filters.status_eq = flags.status
				}

				// eslint-disable-next-line no-await-in-loop
				const exports = await this.cl.exports.list(params)

				if (exports?.length) {
					tableData.push(...exports)
					currentPage = exports.meta.currentPage
					if (currentPage === 1) {
						pageCount = this.computeNumPages(flags, exports.meta)
						totalItems = exports.meta.recordCount
						delay = clApi.requestRateLimitDelay({ resourceType: this.cl.exports.type(), totalRequests: pageCount })
					}
					itemCount += exports.length
					if (delay > 0) await clUtil.sleep(delay)
				}

			}
			cliux.action.stop()

			this.log()

			if (tableData?.length) {

				const table = new Table({
					head: ['ID', 'Resource type', 'Status', 'Items', 'Format', 'Dry data', 'Started at'],
					// colWidths: [100, 200],
					style: {
						head: ['brightYellow'],
						compact: false,
					},
				})

				// let index = 0
				table.push(...tableData.map(e => [
					// { content: ++index, hAlign: 'right' as HorizontalAlignment },
					clColor.blueBright(e.id || ''),
					e.resource_type || '',
					{ content: this.exportStatus(e.status), hAlign: 'center' as HorizontalAlignment },
					{ content: e.records_count, hAlign: 'center' as HorizontalAlignment },
					{ content: e.format, hAlign: 'center' as HorizontalAlignment },
					{ content: (e.dry_data? clText.symbols.check.small : ''), hAlign: 'center' as HorizontalAlignment },
					clOutput.localeDate(e.started_at || ''),
				]))

				this.log(table.toString())

				this.footerMessage(flags, itemCount, totalItems)

			} else this.log(clColor.italic('No exports found'))

			this.log()

			return tableData

		} catch (error) {
			this.handleError(error as CommandError, flags)
		}

	}


	private footerMessage(flags: any, itemCount: number, totalItems: number): void {

		this.log()
		this.log(`Total displayed exports: ${clColor.yellowBright(String(itemCount))}`)
		this.log(`Total export count: ${clColor.yellowBright(String(totalItems))}`)

		if (itemCount < totalItems) {
			if (flags.all || ((flags.limit || 0) > MAX_EXPORTS)) {
				this.log()
				this.warn(`The maximum number of exports that can be displayed is ${clColor.yellowBright(String(MAX_EXPORTS))}`)
			} else
				if (!flags.limit) {
					this.log()
					const displayedMsg = `Only ${clColor.yellowBright(String(itemCount))} of ${clColor.yellowBright(String(totalItems))} records are displayed`
					if (totalItems < MAX_EXPORTS) this.warn(`${displayedMsg}, to see all existing items run the command with the ${clColor.cli.flag('--all')} flag enabled`)
					else this.warn(`${displayedMsg}, to see more items (max ${MAX_EXPORTS}) run the command with the ${clColor.cli.flag('--limit')} flag enabled`)
				}
		}

	}


	private computeNumPages(flags: any, meta: any): number {

		let numRecord = 25
		if (flags.all) numRecord = meta.recordCount
		else
			if (flags.limit) numRecord = flags.limit

		numRecord = Math.min(MAX_EXPORTS, numRecord)
		const numPages = Math.ceil(numRecord / 25)

		return numPages

	}

}
