import Command, { flags } from '../../base'
import chalk from 'chalk'
import Table, { HorizontalAlignment } from 'cli-table3'
import { QueryParamsList } from '@commercelayer/sdk'
import { clConfig, clOutput } from '@commercelayer/cli-core'
import cliux from 'cli-ux'


const MAX_IMPORTS = 1000

export default class ImportsList extends Command {

	static description = 'list all the created imports'

	static aliases = ['imports', 'imp:list']

	static examples = [
		'$ commercelayer imports',
		'$ cl imports:list -A',
		'$ cl imp:list',
	]

	static flags = {
		...Command.flags,
		all: flags.boolean({
			char: 'A',
			description: `show all imports instead of first ${clConfig.api.page_max_size} only`,
			exclusive: ['limit'],
		}),
		type: flags.string({
			char: 't',
			description: 'the type of resource imported',
			options: clConfig.imports.types,
		}),
		group: flags.string({
			char: 'g',
			description: 'the group ID associated to the import in case of multi-chunk imports',
			exclusive: ['all, limit'],
		}),
		status: flags.string({
			char: 's',
			description: 'the import job status',
			options: clConfig.imports.statuses,
		}),
		errors: flags.boolean({
			char: 'e',
			description: 'show only imports with errors',
		}),
		warnings: flags.boolean({
			char: 'w',
			description: 'show only import with warnings',
		}),
		limit: flags.integer({
			char: 'l',
			description: 'limit number of imports in output',
			exclusive: ['all'],
		}),
	}


	async run() {

		const { flags } = this.parse(ImportsList)

		if (flags.limit && (flags.limit < 1)) this.error(chalk.italic('Limit') + ' must be a positive integer')

		const cl = this.commercelayerInit(flags)


		try {

			let pageSize = clConfig.api.page_max_size
			const tableData = []
			let currentPage = 0
			let pageCount = 1
			let itemCount = 0
			let totalItems = 1

			if (flags.limit) pageSize = Math.min(flags.limit, pageSize)

			cliux.action.start('Fetching imports')
			while (currentPage < pageCount) {

				const params: QueryParamsList = {
					pageSize,
					pageNumber: ++currentPage,
					sort: ['-started_at'],
					filters: {},
				}

				if (params && params.filters) {
					if (flags.type) params.filters.resource_type_eq = flags.type
					if (flags.group) params.filters.reference_start = flags.group + '-'
					if (flags.status) params.filters.status_eq = flags.status
					if (flags.warnings) params.filters.warnings_count_gt = 0
					if (flags.warnings) params.filters.errors_count_gt = 0
				}

				// eslint-disable-next-line no-await-in-loop
				const imports = await cl.imports.list(params)

				if (imports?.length) {
					tableData.push(...imports)
					currentPage = imports.meta.currentPage
					if (currentPage === 1) {
						pageCount = this.computeNumPages(flags, imports.meta)
						totalItems = imports.meta.recordCount
					}
					itemCount += imports.length
				}

			}
			cliux.action.stop()

			this.log()

			if (tableData?.length) {

				const table = new Table({
					head: ['ID', 'Resource type', 'Status', 'Prc.', 'Wrn.', 'Err.', 'Started at', 'Group ID'],
					// colWidths: [100, 200],
					style: {
						head: ['brightYellow'],
						compact: false,
					},
				})

				// let index = 0
				table.push(...tableData.map(i => [
					// { content: ++index, hAlign: 'right' as HorizontalAlignment },
					chalk.blueBright(i.id || ''),
					i.resource_type || '',
					{ content: this.importStatus(i.status), hAlign: 'center' as HorizontalAlignment },
					{ content: i.processed_count, hAlign: 'center' as HorizontalAlignment },
					{ content: i.warnings_count, hAlign: 'center' as HorizontalAlignment },
					{ content: i.errors_count, hAlign: 'center' as HorizontalAlignment },
					clOutput.localeDate(i.started_at || ''),
					{ content: ((i.metadata?.group_id || i.metadata?.correlation_id) as string || ''), hAlign: 'center' as HorizontalAlignment },
				]))

				this.log(table.toString())

				this.footerMessage(flags, itemCount, totalItems)

			} else this.log(chalk.italic('No imports found'))

			this.log()

			return tableData

		} catch (error) {
			this.handleError(error, flags)
		}

	}


	private footerMessage(flags: any, itemCount: number, totalItems: number) {

		this.log()
		this.log(`Total displayed imports: ${chalk.yellowBright(String(itemCount))}`)
		this.log(`Total import count: ${chalk.yellowBright(String(totalItems))}`)

		if (itemCount < totalItems) {
			if (flags.all || ((flags.limit || 0) > MAX_IMPORTS)) {
				this.log()
				this.warn(`The maximum number of imports that can be displayed is ${chalk.yellowBright(String(MAX_IMPORTS))}`)
			} else
				if (!flags.limit) {
					this.log()
					const displayedMsg = `Only ${chalk.yellowBright(String(itemCount))} of ${chalk.yellowBright(String(totalItems))} records are displayed`
					if (totalItems < MAX_IMPORTS) this.warn(`${displayedMsg}, to see all existing items run the command with the ${chalk.italic.bold('--all')} flag enabled`)
					else this.warn(`${displayedMsg}, to see more items (max ${MAX_IMPORTS}) run the command with the ${chalk.italic.bold('--limit')} flag enabled`)
				}
		}

	}


	private computeNumPages(flags: any, meta: any): number {

		let numRecord = 25
		if (flags.all) numRecord = meta.recordCount
		else
			if (flags.limit) numRecord = flags.limit

		numRecord = Math.min(MAX_IMPORTS, numRecord)
		const numPages = Math.ceil(numRecord / 25)

		return numPages

	}

}
