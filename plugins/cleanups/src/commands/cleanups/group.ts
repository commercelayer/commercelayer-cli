import Command, { Args, cliux } from '../../base'
import Table, { type HorizontalAlignment } from 'cli-table3'
import type { Cleanup, QueryPageSize, QueryParamsList } from '@commercelayer/sdk'
import { clColor, clConfig, clOutput } from '@commercelayer/cli-core'
import type { CommandError } from '@oclif/core/lib/interfaces'



export default class CleanupsGroup extends Command {

	static description = 'list all the cleanups related to a cleanup group'

	static aliases = ['clp:group']

	static examples = [
		'$ commercelayer cleanups:group <group-id>',
		'$ cl clp:group <group-id>',
  ]


	static args = {
		group_id: Args.string({ name: 'group_id', description: 'unique id of the group cleanup', required: true, hidden: false }),
  }


	async run(): Promise<any> {

		const { args, flags } = await this.parse(CleanupsGroup)

		const groupId = args.group_id

		const cl = this.commercelayerInit(flags)


		try {

			const pageSize = clConfig.api.page_max_size as QueryPageSize
			const tableData = []
			let currentPage = 0
			let pageCount = 1

			cliux.action.start('Fetching cleanups')
			while (currentPage < pageCount) {

				const params: QueryParamsList<Cleanup> = {
					pageSize,
					pageNumber: ++currentPage,
					sort: ['reference', '-completed_at'],
					filters: { reference_start: `${groupId}-` },
				}


				// eslint-disable-next-line no-await-in-loop
				const cleanups = await cl.cleanups.list(params)

				if (cleanups?.length) {
					tableData.push(...cleanups)
					currentPage = cleanups.meta.currentPage
					pageCount = cleanups.meta.pageCount
				}

			}

			cliux.action.stop()

			this.log()

			if (tableData?.length) {

				const table = new Table({
					head: ['ID', 'Resource type', 'Status', 'Prc.', 'Err.', 'Started at', 'Completed at'],
					// colWidths: [100, 200],
					style: {
						head: ['brightYellow'],
						compact: false,
					},
				})

				// let index = 0
				table.push(...tableData.map(c => [
					// { content: ++index, hAlign: 'right' as HorizontalAlignment },
					clColor.blueBright(c.id || ''),
					c.resource_type || '',
					{ content: this.cleanupStatus(c.status), hAlign: 'center' as HorizontalAlignment },
					{ content: c.processed_count, hAlign: 'center' as HorizontalAlignment },
					{ content: c.errors_count, hAlign: 'center' as HorizontalAlignment },
					clOutput.localeDate(c.started_at || ''),
					clOutput.localeDate(c.completed_at || ''),
				]))

				this.log(table.toString())

				this.log()

			} else this.log(clColor.italic(`Cleanup group with id ${groupId} not found`))

			this.log()

			return tableData

		} catch (error) {
      if (cl.isApiError(error) && (error.status === 404))
        this.error(`Unable to find cleanup group${groupId ? ` with id ${clColor.msg.error(groupId)}` : ''}`)
			else this.handleError(error as CommandError, flags)
		}

	}

}
