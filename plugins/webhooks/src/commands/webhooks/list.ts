import { BaseCommand, Flags } from '../../base'
import Table, { type HorizontalAlignment } from 'cli-table3'
import type { QueryParamsList } from '@commercelayer/sdk'
import { clColor } from '@commercelayer/cli-core'


export default class WebhooksList extends BaseCommand {

	static description = 'list all the registered webhooks'

	static aliases = ['wh:list']

	static examples = [
		'$ commercelayer webhooks',
		'$ cl webhooks:list -c open',
		'$ cl wh:list',
	]

	static flags = {
		circuit: Flags.string({
			char: 'c',
			description: 'show only webhooks with circuit in the declared state',
			options: ['open', 'closed'],
		}),
		topic: Flags.string({
			char: 't',
			description: 'the event that triggered the webhook',
		}),
	}


	async run(): Promise<any> {

		const { flags } = await this.parse(WebhooksList)

		const cl = this.commercelayerInit(flags)


		try {

			let tableData = []
			let currentPage = 0
			let pageCount = 1

			while (currentPage < pageCount) {

				const params: QueryParamsList = {
					pageSize: 25,
					pageNumber: ++currentPage,
				}

				if (flags.topic) params.filters = { topic_eq: flags.topic }

				// eslint-disable-next-line no-await-in-loop
				const webhooks = await cl.webhooks.list(params)

				if (webhooks?.length) {
					tableData.push(...webhooks)
					currentPage = webhooks.meta.currentPage
					pageCount = webhooks.meta.pageCount
				}

			}


			if (flags.circuit && tableData?.length) tableData = tableData.filter(w => (w.circuit_state === flags.circuit))

			this.log()

			if (tableData?.length) {

				const table = new Table({
					head: ['ID', 'Name', 'Topic', 'Circuit state', 'Recent failures'],
					// colWidths: [100, 200],
					style: {
						head: ['brightYellow'],
						compact: false,
					},
				})

				// let index = 0
				table.push(...tableData.map(w => [
					// { content: ++index, hAlign: 'right' as HorizontalAlignment },
					clColor.table.key(w.id || ''),
					w.name || '',
					w.topic || '',
					{ content: ((w.circuit_state === 'closed') ? clColor.msg.success : clColor.msg.error)(w.circuit_state || ''), hAlign: 'center' as HorizontalAlignment },
					{ content: printFailures(w.circuit_failure_count), hAlign: 'center' as HorizontalAlignment },
				]))

				this.log(table.toString())

			} else this.log(clColor.italic(`No webhooks found${flags.circuit ? (' with circuit state ' + clColor.cli.flag(flags.circuit)) : ''}`))

			this.log()

			return tableData

		} catch (error: any) {
			this.handleError(error, flags)
		}

	}

}


const printFailures = (failures?: number): string => {
	if (!failures || (failures === 0)) return String(failures || 0)
	if (failures >= 10) return clColor.msg.error(String(failures))
	return clColor.msg.warning(String(failures))
}
