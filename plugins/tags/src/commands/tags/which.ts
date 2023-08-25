import { BaseIdCommand, Flags, cliux } from '../../base'
import Table from 'cli-table3'
import type { CommerceLayerClient, QueryParamsList, Tag } from '@commercelayer/sdk'
import { clApi, clColor, clConfig, clOutput, clText, clUtil } from '@commercelayer/cli-core'
import type { ApiResource, ListResponse } from '@commercelayer/sdk/lib/cjs/resource'
import type { TaggableResource } from '@commercelayer/sdk/lib/cjs/api'


const MAX_RESOURCES = 1000

export default class TagsWhich extends BaseIdCommand {

	static description = 'show all the resources with this tag'

	static examples = [
		'$ commercelayer tags:which <tag-id-or-name> -t <resource-type>',
		'$ cl tags:which groupA -t customers -A'
	]

	static flags = {
		type: Flags.string({
			char: 't',
			description: 'the type of the tagged resources',
			required: true
		}),
		all: Flags.boolean({
			char: 'A',
			description: `show all resources instead of first ${clConfig.api.page_max_size} only`,
			exclusive: ['limit'],
		}),
		limit: Flags.integer({
			char: 'l',
			description: 'limit number of resources in output',
			exclusive: ['all'],
		}),
	}


	async run(): Promise<any> {

		const { args, flags } = await this.parse(TagsWhich)

		const resType = flags.type
		this.checkResourceType(resType)

		const limit = flags.limit
		if (limit && (limit < 1)) this.error(clColor.italic('Limit') + ' must be a positive integer')

		this.commercelayerInit(flags)

		const idOrName = args.id_name
		const tag = await this.checkTag(idOrName, true)
		if (!tag) this.exit()


		try {

			const client: ApiResource<TaggableResource> = this.cl[resType as keyof CommerceLayerClient] as ApiResource<TaggableResource>

			let pageSize = clConfig.api.page_max_size
			const tableData = []
			let currentPage = 0
			let pageCount = 1
			let itemCount = 0
			let totalItems = 1

			if (limit) pageSize = Math.min(limit, pageSize)

			cliux.action.start(`Fetching ${clApi.humanizeResource(flags.type)}`)
			let delay = 0
			while (currentPage < pageCount) {

				const params: QueryParamsList = {
					pageSize,
					pageNumber: ++currentPage,
					sort: ['-created_at'],
					filters: { tags_id_eq: tag.id },
					include: ['tags']
				}

				const resources: ListResponse<TaggableResource> = await client.list(params)

				if (resources?.length) {
					tableData.push(...resources)
					currentPage = resources.meta.currentPage
					if (currentPage === 1) {
						pageCount = this.computeNumPages(flags, resources.meta)
						totalItems = resources.meta.recordCount
						delay = clApi.requestRateLimitDelay({ resourceType: this.cl.tags.type(), totalRequests: pageCount })
					}
					itemCount += resources.length
					if (delay > 0) await clUtil.sleep(delay)
				}

			}
			cliux.action.stop()

			this.log()

			if (tableData?.length) {

				const table = new Table({
					head: ['ID', 'Tags', 'Created at', 'Updated at'],
					colWidths: [12, 38],
					style: {
						head: ['brightYellow'],
						compact: false,
					},
					wordWrap: true,
					wrapOnWordBoundary: true
				})

				// let index = 0
				table.push(...tableData.map(e => [
					// { content: ++index, hAlign: 'right' as HorizontalAlignment },
					clColor.blueBright(e.id || ''),
					e.tags?.map(t => {
						let tn = (t as Tag).name
						if (((e.tags || []).length > 1) && (tn === tag.name)) tn = clColor.cyanBright(tn)
						return tn
					}).join(', '),
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

		const humanized = clApi.humanizeResource(flags.type)

		this.log()
		this.log(`Total displayed ${humanized}: ${clColor.yellowBright(String(itemCount))}`)
		this.log(`Total ${clText.singularize(humanized)} count: ${clColor.yellowBright(String(totalItems))}`)

		if (itemCount < totalItems) {
			if (flags.all || ((flags.limit || 0) > MAX_RESOURCES)) {
				this.log()
				this.warn(`The maximum number of ${humanized} that can be displayed is ${clColor.yellowBright(String(MAX_RESOURCES))}`)
			} else if (!flags.limit) {
				this.log()
				const displayedMsg = `Only ${clColor.yellowBright(String(itemCount))} of ${clColor.yellowBright(String(totalItems))} records are displayed`
				if (totalItems < MAX_RESOURCES) this.warn(`${displayedMsg}, to see all existing items run the command with the ${clColor.cli.flag('--all')} flag enabled`)
				else this.warn(`${displayedMsg}, to see more items (max ${MAX_RESOURCES}) run the command with the ${clColor.cli.flag('--limit')} flag enabled`)
			}
		}

	}


	private computeNumPages(flags: any, meta: any): number {

		let numRecord = clConfig.api.page_max_size
		if (flags.all) numRecord = meta.recordCount
		else
			if (flags.limit) numRecord = flags.limit

		numRecord = Math.min(MAX_RESOURCES, numRecord)
		const numPages = Math.ceil(numRecord / clConfig.api.page_max_size)

		return numPages

	}

}
