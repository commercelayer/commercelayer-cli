import Command, { Flags, cliux } from '../../base'
import Table from 'cli-table3'
import type { QueryParamsList } from '@commercelayer/sdk'
import { clApi, clColor, clConfig, clOutput, clUtil } from '@commercelayer/cli-core'


const MAX_TAGS = 1000

export default class TagsList extends Command {

	static description = 'list all the created tags'

	static examples = [
		'$ commercelayer tags',
		'$ cl tags:list -A'
	]

	static flags = {
		all: Flags.boolean({
			char: 'A',
			description: `show all tags instead of first ${clConfig.api.page_max_size} only`,
			exclusive: ['limit'],
		}),
		limit: Flags.integer({
			char: 'l',
			description: 'limit number of tags in output',
			exclusive: ['all'],
		}),
	}


	async run(): Promise<any> {

		const { flags } = await this.parse(TagsList)

		if (flags.limit && (flags.limit < 1)) this.error(clColor.italic('Limit') + ' must be a positive integer')

		this.commercelayerInit(flags)


		try {

			let pageSize = clConfig.api.page_max_size
			const tableData = []
			let currentPage = 0
			let pageCount = 1
			let itemCount = 0
			let totalItems = 1

			if (flags.limit) pageSize = Math.min(flags.limit, pageSize)

			cliux.action.start('Fetching tags')
			let delay = 0
			while (currentPage < pageCount) {

				const params: QueryParamsList = {
					pageSize,
					pageNumber: ++currentPage,
					sort: ['-created_at'],
					filters: {},
				}

				const tags = await this.cl.tags.list(params)

				if (tags?.length) {
					tableData.push(...tags)
					currentPage = tags.meta.currentPage
					if (currentPage === 1) {
						pageCount = this.computeNumPages(flags, tags.meta)
						totalItems = tags.meta.recordCount
						delay = clApi.requestRateLimitDelay({ resourceType: this.cl.tags.type(), totalRequests: pageCount })
					}
					itemCount += tags.length
					if (delay > 0) await clUtil.sleep(delay)
				}

			}
			cliux.action.stop()

			this.log()

			if (tableData?.length) {

				const table = new Table({
					head: ['ID', 'Tag name', 'Reference', 'Created at', 'Updated at'],
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
					e.name || '',
					e.reference || '',
					clOutput.localeDate(e.created_at || ''),
					clOutput.localeDate(e.updated_at || ''),
				]))

				this.log(table.toString())

				this.footerMessage(flags, itemCount, totalItems)

			} else this.log(clColor.italic('No tags found'))

			this.log()

			return tableData

		} catch (error: any) {
			this.handleError(error, flags)
		}

	}


	private footerMessage(flags: any, itemCount: number, totalItems: number): void {

		this.log()
		this.log(`Total displayed tags: ${clColor.yellowBright(String(itemCount))}`)
		this.log(`Total tag count: ${clColor.yellowBright(String(totalItems))}`)

		if (itemCount < totalItems) {
			if (flags.all || ((flags.limit || 0) > MAX_TAGS)) {
				this.log()
				this.warn(`The maximum number of tags that can be displayed is ${clColor.yellowBright(String(MAX_TAGS))}`)
			} else if (!flags.limit) {
				this.log()
				const displayedMsg = `Only ${clColor.yellowBright(String(itemCount))} of ${clColor.yellowBright(String(totalItems))} records are displayed`
				if (totalItems < MAX_TAGS) this.warn(`${displayedMsg}, to see all existing items run the command with the ${clColor.cli.flag('--all')} flag enabled`)
				else this.warn(`${displayedMsg}, to see more items (max ${MAX_TAGS}) run the command with the ${clColor.cli.flag('--limit')} flag enabled`)
			}
		}

	}


	private computeNumPages(flags: any, meta: any): number {

		let numRecord = clConfig.api.page_max_size
		if (flags.all) numRecord = meta.recordCount
		else
			if (flags.limit) numRecord = flags.limit

		numRecord = Math.min(MAX_TAGS, numRecord)
		const numPages = Math.ceil(numRecord / clConfig.api.page_max_size)

		return numPages

	}

}
