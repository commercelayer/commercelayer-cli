import { BaseCommand, Flags, cliux } from '../../base'
import Table, { type HorizontalAlignment } from 'cli-table3'
import type { Link, QueryArraySortable, QueryPageSize, QueryParamsList, QueryRecordSortable } from '@commercelayer/sdk'
import { type KeyValSort, clApi, clColor, clConfig, clUtil } from '@commercelayer/cli-core'
import { fillUTCDate, formatDate, linkStatus } from '../../util'


const MAX_LINKS = 1000

type ComparisonOperator = 'eq' | 'gt' | 'lt' | 'lteq' | 'gteq'
type ComparisonFilter = { op: ComparisonOperator, value: string }

const SORTABLE_FIELDS = ['name', 'starts_at', 'expires_at', 'created_at', 'updated_at', 'disabled_at']


export default class LinksList extends BaseCommand {

	static description = 'list all the created links'

	static examples = [
		'$ commercelayer links',
		'$ cl links:list -A',
		'$ cl links --status=pending',
	]

	static help: 'help for command links:list'

	static flags = {
		all: Flags.boolean({
			char: 'A',
			description: `show all links instead of first ${clConfig.api.page_max_size} only`,
			exclusive: ['limit']
		}),
		limit: Flags.integer({
			char: 'l',
			description: 'limit number of links in output',
			exclusive: ['all']
		}),
		name: Flags.string({
			char: 'n',
			description: 'the name of the link'
		}),
		link_scope: Flags.string({
			char: 'S',
			description: 'the scope of the link',
			required: false,
			multiple: false
		}),
		starts: Flags.string({
			char: 's',
			summary: 'the link\'s start date and time',
			description: 'Look at the description of flag \'expires\' for details',
			required: false,
			multiple: true
		}),
		expires: Flags.string({
			char: 'e',
			summary: 'the link\'s expiration date and time',
			description: `Use the standard ISO format with operators [gt, gteq, eq, lt, lteq].
A maximum of 2 parameters can be used for date filters.
If the operator is omitted the default operator 'eq' will be used.\n
If only one parameter is defined without an operator, it is interpreted as a range of values
Examples:
	-s 2024 will be translated into -s gteq=2024-01-01T00:00:00Z lt=2025-01-01T00:00:00Z
	-s 2024-04-10 will be translated into -s gteq=2024-04-10T00:00:00Z lt=2024-04-11T00:00:00Z
	-s 2024-04-10T13:15:00 will be translated into -s gteq 2024-04-10T13:15:00Z lt=2024-04-10T13:16:00Z`,
			required: false,
			multiple: true
		}),
		sort: Flags.string({
			description: 'a comma separated list of fields to sort by',
			multiple: true
		}),
		locale: Flags.boolean({
      char: 'L',
      description: 'show dates in locale time zone and format'
    })
		/*,
		utc: Flags.boolean({
      char: 'U',
      description: 'show dates in UTC format'
    })
		*/
	}


	async run(): Promise<any> {

		const { flags } = await this.parse(LinksList)

		if (flags.limit && (flags.limit < 1)) this.error(clColor.italic('Limit') + ' must be a positive integer')

		const startsFilter: ComparisonFilter[] = []
		const expiresFilter: ComparisonFilter[] = []
		if (flags.starts) startsFilter.push(...this.comparisonParam(flags.starts, 'starts'))
		if (flags.expires) expiresFilter.push(...this.comparisonParam(flags.expires, 'expires'))

		const sortBy = this.sortFlag(flags.sort)
		const sort: QueryArraySortable<Link> | QueryRecordSortable<Link> = (sortBy && (Object.keys(sortBy).length > 0)) ? sortBy : ['-expires_at', '-starts_at']

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
					sort,
					filters: {},
					include: ['item'],
					fields: {
						orders: ['id', 'number'],
						sku_lists: ['id', 'name'],
						bundles: ['id', 'name', 'code'],
						skus: ['id', 'name', 'code']
					},
				}

				if (params?.filters) {
					// if (flags.type) params.filters.item_type_in = flags.type.join(',')
					// if (flags.status) params.filters.status_in = flags.status.join(',')
					if (flags.name) params.filters.name_cont = flags.name
					if (flags.link_scope) params.filters.scope_cont = flags.link_scope
					if (startsFilter?.length > 0) for (const f of startsFilter) params.filters[`starts_at_${f.op}`] = f.value
					if (expiresFilter?.length > 0) for (const f of expiresFilter) params.filters[`expires_at_${f.op}`] = f.value
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
					head: ['ID', 'Name', 'Item type', /* 'Item ID', */'Status', 'Starts at', 'Expires at'],
					// colWidths: [100, 200],
					style: {
						head: ['brightYellow'],
						compact: false
					}
				})


				table.push(...tableData.map(i => [
					clColor.blueBright(i.id || ''),
					i.name,
					i.item?.type,
					// i.item?.id || '',
					{ content: linkStatus(i.status), hAlign: 'center' as HorizontalAlignment },
					formatDate(i.starts_at, flags.locale),
					formatDate(i.expires_at, flags.locale)
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


	private comparisonParam(params: string[], name?: string): ComparisonFilter[] {

		const filter: ComparisonFilter[] = []

		if (params.length === 0) return filter
		if ((params.length === 2) || ((params.length === 1) && (params[0].includes('=')))) {
			for (const p of params) {
				const opval = p.split('=')
				const op: string = (opval.length > 1) ? opval[0] : 'eq'
				const val: string = (opval.length > 1) ? this.checkDateValue(opval[1]) : this.checkDateValue(opval[0])
				if (!['eq', 'lt', 'gt', 'lteq', 'gteq'].includes(op)) this.error(`${name ? `Flag ${name}: ` : ''}Invalid filter [${p}]`)
				filter.push({ op: op as ComparisonOperator, value: val })
			}
			return filter
		}
		if (params.length > 2) this.error(`${name ? `Flag ${name}: ` : ''}Date filters cannot have more than 2 params [${params.join(', ')}]`)


		// Only one filter param
		const param = params[0]

		const gteq = this.checkDateValue(param)	// check iso format
		let lt

		const dateTime = param.replace('Z', '').split('T')
		if (dateTime.length === 2) {	// date and time
			const time = dateTime[1]
			const hhmmss = (time.includes('.') ? time.substring(0, time.indexOf('.')) : time).split(':')
			const nextTime = new Date(fillUTCDate(param))
			switch (hhmmss.length) {
				// hour, minute and second
				case 3: { nextTime.setUTCSeconds(nextTime.getUTCSeconds() + 1); break }
				// hour and minute
				case 2: { nextTime.setUTCMinutes(nextTime.getUTCMinutes() + 1); break }
				// only hour
				case 1: { nextTime.setUTCHours(nextTime.getUTCHours() + 1); break }
			}
			lt = nextTime.toISOString()
		} else {	// only date
			const date = dateTime[0]
			const yyyymmdd = date.split('-')
			const nextDate = new Date(fillUTCDate(date))
			switch (yyyymmdd.length) {
				// year, month and day
				case 3: { nextDate.setUTCDate(nextDate.getUTCDate() + 1); break }
				// year and month
				case 2: { nextDate.setUTCMonth(nextDate.getUTCMonth() + 1); break }
				// only year
				case 1: { nextDate.setUTCFullYear(nextDate.getUTCFullYear() + 1); break }
			}
			lt = nextDate.toISOString()
		}

		filter.push({ op: 'gteq', value: gteq })
		if (lt) filter.push({ op: 'lt', value: lt })

		return filter

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


	private sortFlag(flag: string[] | undefined): KeyValSort {

		const sort: KeyValSort = {}

		if (flag && (flag.length > 0)) {

			flag.forEach(f => {

				const ot = f.split(',')
				if (ot.length > 2) this.error('Can be defined only one field for each sort flag',
					{ suggestions: [`Split the value ${clColor.style.attribute(f)} into two or more sort flags`] }
				)

				const of = ot[0]
				if (!SORTABLE_FIELDS.includes(of)) this.error(`Invalid sort field: ${clColor.msg.error(of)}`,
					{ suggestions: [`Sort field must be one of [${SORTABLE_FIELDS.join(', ')}]`] })
				if (of.startsWith('-')) this.error(`Invalid sort syntax: ${clColor.msg.error(of)}`,
					{ suggestions: [`To sort records you can use only the syntax ${clColor.cli.value('<field>,<order>')} and not the syntax ${clColor.cli.value('[-]<field>')}`] }
				)
				const sd = ot[1] || 'asc'
				if (!['asc', 'desc'].includes(sd)) this.error(`Invalid sort flag: ${clColor.msg.error(f)}`,
					{ suggestions: [`Sort direction can assume only the values ${clColor.cli.value('asc')} or ${clColor.cli.value('desc')}`] }
				)

				sort[of] = sd as 'asc' | 'desc'

			})

		}

		return sort

	}

}
