import Command from '../../base'
import chalk from 'chalk'
import Table, { HorizontalAlignment } from 'cli-table3'
import { QueryParamsList } from '@commercelayer/sdk'
import apiConf from '../../api-conf'
import { localeDate } from '../../common'
import cliux from 'cli-ux'


export default class ImportsGroup extends Command {

	static description = 'list all the imports related to an import group'

	static aliases = ['imp:group']

	static examples = [
		'$ commercelayer imports:group <group-id>',
		'$ cl imports:ghroup <group-id>',
	]

	static flags = {
		...Command.flags,
	}

	static args = [
		{ name: 'group_id', description: 'unique id of the group import', required: true, hidden: false },
	]


	async run() {

		const { args, flags } = this.parse(ImportsGroup)

		const groupId = args.group_id

		const cl = this.commercelayerInit(flags)


		try {

			const pageSize = apiConf.page_max_size
			const tableData = []
			let currentPage = 0
			let pageCount = 1

			cliux.action.start('Fetching imports')
			while (currentPage < pageCount) {

				const params: QueryParamsList = {
					pageSize,
					pageNumber: ++currentPage,
					sort: ['reference', '-completed_at'],
					filters: { reference_start: `${groupId}-` },
				}


				// eslint-disable-next-line no-await-in-loop
				const imports = await cl.imports.list(params)

				if (imports?.length) {
					tableData.push(...imports)
					currentPage = imports.meta.currentPage
					pageCount = imports.meta.pageCount
				}

			}
			cliux.action.stop()

			this.log()

			if (tableData?.length) {

				const table = new Table({
					head: ['ID', 'Resource type', 'Status', 'Prc.', 'Wrn.', 'Err.', 'Started at', 'Completed at'],
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
					localeDate(i.started_at || ''),
					localeDate(i.completed_at || ''),
				]))

				this.log(table.toString())

				this.log()

			} else this.log(chalk.italic(`Import group with id ${groupId} not found`))

			this.log()

			return tableData

		} catch (error) {
			this.handleError(error, flags)
		}

	}

}
