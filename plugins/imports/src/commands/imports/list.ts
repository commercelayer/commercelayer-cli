import Command, { flags } from '../../base'
import chalk from 'chalk'
import CommerceLayer from '@commercelayer/sdk'
import Table, { HorizontalAlignment } from 'cli-table3'
import { QueryParamsList } from '@commercelayer/sdk/lib/query'
import apiConf from '../../api-conf'
import { localeDate } from '../../common'
import cliux from 'cli-ux'


export default class ImportsList extends Command {

  static description = 'list all the created imports'

  static aliases = ['imp:list']

  static examples = [
    '$ commercelayer imports',
    '$ cl imports:list -A',
    '$ cl imp:list',
  ]

  static flags = {
    ...Command.flags,
    all: flags.boolean({
      char: 'A',
      description: `show all imports instead of first ${apiConf.page_max_size} only `,
    }),
    type: flags.string({
      char: 't',
      description: 'the type of resource imported',
      options: apiConf.imports_types,
    }),
    group: flags.string({
      char: 'g',
      description: 'the group ID associated to the import in case of multi-chunk imports',
      exclusive: ['all'],
    }),
    status: flags.string({
      char: 's',
      description: 'the import job status',
      options: apiConf.imports_statuses,
    }),
    errors: flags.boolean({
      char: 'e',
      description: 'show only imports with errors',
    }),
    warnings: flags.boolean({
      char: 'w',
      description: 'show only import with warnings',
    }),
  }


  async run() {

    const { flags } = this.parse(ImportsList)

    const organization = flags.organization
    const accessToken = flags.accessToken
    const domain = flags.domain

    // eslint-disable-next-line new-cap
    const cl = CommerceLayer({
      organization,
      domain,
      accessToken,
    })


    try {

      const pageSize = apiConf.page_max_size
      const tableData = []
      let currentPage = 0
      let pageCount = 1
      let totalItems = 1

      cliux.action.start('Fetching imports')
      while (currentPage < pageCount) {

        const params: QueryParamsList = {
          pageSize,
          pageNumber: ++currentPage,
          sort: ['-completed_at'],
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
          if (flags.all) pageCount = imports.meta.pageCount
          totalItems = imports.meta.recordCount
        }

      }
      cliux.action.stop()

      this.log()

      if (tableData?.length) {

        const table = new Table({
          head: ['ID', 'Resource type', 'Status', 'Processed', 'Warnings', 'Errors', 'Completed at', 'Group ID'],
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
          localeDate(i.completed_at || ''),
          { content: ((i.metadata?.group_id || i.metadata?.correlation_id) as string || ''), hAlign: 'center' as HorizontalAlignment },
        ]))

        this.log(table.toString())

        this.log()
        if (flags.all) this.log(`Total imports count: ${chalk.yellowBright(String(totalItems))}`)
        else this.warn(`Only ${chalk.yellowBright(String(pageSize))} of ${chalk.yellowBright(String(totalItems))} records are displayed, to see all existing items run the command with the ${chalk.italic.bold('All')} flag enabled`)

      } else this.log(chalk.italic('No imports found'))

      this.log()

      return tableData

    } catch (error) {
      this.printError(error)
    }

  }

}
