import Command from '../../base'
import chalk from 'chalk'
import CommerceLayer from '@commercelayer/sdk'
import Table, { HorizontalAlignment } from 'cli-table3'


export default class WebhooksList extends Command {

  static description = 'list all the registered webhooks'

  static aliases = ['wh:list']

  static examples = [
		'$ commercelayer webhooks',
		'$ cl webhooks:list',
		'$ cl wh:list',
	]

  static flags = {
		...Command.flags,
	}

  async run() {

    const { flags } = this.parse(WebhooksList)

    const organization = flags.organization
    const accessToken = flags.accessToken

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
        // eslint-disable-next-line no-await-in-loop
        const webhooks = await cl.webhooks.list({ pageSize: 25, pageNumber: ++currentPage })
        if (webhooks?.length) {
          tableData.push(...webhooks)
          currentPage = webhooks.meta.currentPage
          pageCount = webhooks.meta.pageCount
        }
      }


      if (tableData) {

        this.log()
        const table = new Table({
          head: ['ID', 'Topic', 'Circuit state', 'Failures'],
          // colWidths: [100, 200],
          style: {
            head: ['yellow'],
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
        this.log()

      }

      return tableData

    } catch (error) {
      this.printError(error)
    }

  }

}
