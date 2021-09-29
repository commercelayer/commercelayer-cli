import Command from '../../base'
import chalk from 'chalk'
import CommerceLayer from '@commercelayer/sdk'
import Table, { HorizontalAlignment } from 'cli-table3'
import { QueryParamsList } from '@commercelayer/sdk/lib/query'


export default class WebhooksEvents extends Command {

  static description = 'list all the events associated to the webhook'

  static aliases = ['wh:events']

  static examples = [
		'$ commercelayer webhooks:events <webhook-id>',
		'$ cl wh:events <webhook-id>',
	]

  static flags = {
		...Command.flags,
	}

  static args = [
		{ name: 'id', description: 'unique id of the webhook', required: true, hidden: false },
	]


  async run() {

    const { args, flags } = this.parse(WebhooksEvents)

    const { organization, accessToken } = flags
    const id = args.id

    // eslint-disable-next-line new-cap
    const cl = CommerceLayer({
      organization,
      accessToken,
    })


    try {

      const tableData = []
      let currentPage = 0
      let pageCount = 1

      while (currentPage < pageCount) {

        const params: QueryParamsList = {
          pageSize: 25,
          pageNumber: ++currentPage,
        }

        // eslint-disable-next-line no-await-in-loop
        const webhooks = await cl.webhooks.list(params)

        if (webhooks?.length) {
          tableData.push(...webhooks)
          currentPage = webhooks.meta.currentPage
          pageCount = webhooks.meta.pageCount
        }

      }


      this.log()

      if (tableData?.length) {

        const table = new Table({
          head: ['ID', 'Topic', 'Circuit state', 'Recent failures'],
          // colWidths: [100, 200],
          style: {
            head: ['brightYellow'],
            compact: false,
          },
        })

        // let index = 0
        table.push(...tableData.map(w => [
          // { content: ++index, hAlign: 'right' as HorizontalAlignment },
          chalk.blueBright(w.id || ''),
          w.topic || '',
          { content: ((w.circuit_state === 'closed') ? chalk.green : chalk.red)(w.circuit_state || ''), hAlign: 'center' as HorizontalAlignment },
          { content: w.circuit_failure_count, hAlign: 'center' as HorizontalAlignment },
        ]))

        this.log(table.toString())

      } else this.log(chalk.italic(`No events found for webhook ${id}`))

      this.log()

      return tableData

    } catch (error) {
      this.printError(error)
    }

  }

}
