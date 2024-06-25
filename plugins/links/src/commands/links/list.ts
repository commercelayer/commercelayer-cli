import { BaseCommand, Flags, cliux } from '../../base'
import Table, { type HorizontalAlignment } from 'cli-table3'
import type { Link, QueryPageSize, QueryParamsList } from '@commercelayer/sdk'
import { clApi, clColor, clConfig, clOutput, clUtil } from '@commercelayer/cli-core'
import { linkStatus } from '../../util'


const MAX_LINKS = 1000

export default class LinksList extends BaseCommand {

	static description = 'list all the created links'

	static examples = [
		'$ commercelayer links',
		'$ cl links:list -A',
		'$ cl links --status=pending',
	]

	static flags = {
		all: Flags.boolean({
			char: 'A',
			description: `show all links instead of first ${clConfig.api.page_max_size} only`,
			exclusive: ['limit']
		}),
		type: Flags.string({
			char: 't',
			description: 'the type of the item',
			options: clConfig.links.linkable_resources as string[],
			multiple: false
		}),
		status: Flags.string({
			char: 's',
			description: 'the link status',
			options: ['active', 'disabled', 'pending', 'expired'],
			multiple: false
		}),
		limit: Flags.integer({
			char: 'l',
			description: 'limit number of links in output',
			exclusive: ['all']
		})
	}


	async run(): Promise<any> {

		const { flags } = await this.parse(LinksList)

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

			cliux.action.start('Fetching links')
			let delay = 0
			while (currentPage < pageCount) {

				const params: QueryParamsList<Link> = {
					pageSize,
					pageNumber: ++currentPage,
					sort: ['-created_at'],
					filters: {},
					include: ['item'],
					fields: { orders: ['id'], sku_lists: ['id'], bundles: ['id'], skus: ['id'] }
				}

				if (params?.filters) {
					if (flags.type) params.filters.resource_type_eq = flags.type
					if (flags.status) params.filters.status_eq = flags.status
				}


				const links = await this.cl.links.list(params)

				if (links?.length) {
					tableData.push(...links)
					currentPage = links.meta.currentPage
					if (currentPage === 1) {
						pageCount = this.computeNumPages(flags, links.meta)
						totalItems = links.meta.recordCount
						delay = clApi.requestRateLimitDelay({ resourceType: this.cl.links.type(), totalRequests: pageCount })
					}
					itemCount += links.length
					if (delay > 0) await clUtil.sleep(delay)
				}

			}
			cliux.action.stop()

			this.log()

			if (tableData?.length) {

				const table = new Table({
					head: ['ID', 'Item type', 'Item ID', 'Status', 'Created at', 'Disabled at'],
					// colWidths: [100, 200],
					style: {
						head: ['brightYellow'],
						compact: false,
					},
				})

				// let index = 0
				table.push(...tableData.map(i => [
					// { content: ++index, hAlign: 'right' as HorizontalAlignment },
					clColor.blueBright(i.id || ''),
					i.item?.type || '',
					i.item?.id || '',
					{ content: linkStatus(i.status), hAlign: 'center' as HorizontalAlignment },
					clOutput.localeDate(i.created_at || ''),
					clOutput.localeDate(i.disabled_at || '')
				]))

				this.log(table.toString())

				this.footerMessage(flags, itemCount, totalItems)

			} else this.log(clColor.italic('No links found'))

			this.log()

			return tableData

		} catch (error: any) {
			await this.handleError(error as Error, flags)
		}

	}


	private footerMessage(flags: any, itemCount: number, totalItems: number): void {

		this.log()
		this.log(`Total displayed links: ${clColor.yellowBright(String(itemCount))}`)
		this.log(`Total link count: ${clColor.yellowBright(String(totalItems))}`)

		if (itemCount < totalItems) {
			if (flags.all || ((flags.limit || 0) > MAX_LINKS)) {
				this.log()
				this.warn(`The maximum number of links that can be displayed is ${clColor.yellowBright(String(MAX_LINKS))}`)
			} else
				if (!flags.limit) {
					this.log()
					const displayedMsg = `Only ${clColor.yellowBright(String(itemCount))} of ${clColor.yellowBright(String(totalItems))} records are displayed`
					if (totalItems < MAX_LINKS) this.warn(`${displayedMsg}, to see all existing items run the command with the ${clColor.cli.flag('--all')} flag enabled`)
					else this.warn(`${displayedMsg}, to see more items (max ${MAX_LINKS}) run the command with the ${clColor.cli.flag('--limit')} flag enabled`)
				}
		}

	}


	private computeNumPages(flags: any, meta: any): number {

		let numRecord = 25
		if (flags.all) numRecord = meta.recordCount
		else
			if (flags.limit) numRecord = flags.limit

		numRecord = Math.min(MAX_LINKS, numRecord)
		const numPages = Math.ceil(numRecord / 25)

		return numPages

	}

}
