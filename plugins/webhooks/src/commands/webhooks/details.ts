import Command, { flags } from '../../base'
import chalk from 'chalk'
import CommerceLayer from '@commercelayer/sdk'
import Table  from 'cli-table3'
import _ from 'lodash'


export default class WebhooksDetails extends Command {

  static description = 'show the details of an existing webhook'

  static aliases = ['webhook', 'wh:details']

  static examples = [
		'$ commercelayer webhooks:details <webhook-id>',
		'$ cl webhook <webhook-id> -H',
    '$ cl wh:details <webhook-id>',
	]

  static flags = {
		...Command.flags,
    'hide-empty': flags.boolean({
      char: 'H',
      description: 'hide empty attributes',
    }),
	}

	static args = [
		{ name: 'id', description: 'unique id of the webhook', required: true, hidden: false },
	]


  async run() {

    const { args, flags } = this.parse(WebhooksDetails)

    const organization = flags.organization
    const accessToken = flags.accessToken
    const id = args.id

    // eslint-disable-next-line new-cap
    const cl = CommerceLayer({
      organization,
      accessToken,
    })


    try {

      const webhook = await cl.webhooks.retrieve(id)

      const table = new Table({
        // head: ['ID', 'Topic', 'Circuit state', 'Failures'],
        colWidths: [23, 67],
        wordWrap: true,
      })



      // let index = 0
      table.push(...Object.entries(webhook)
        .filter(([k]) => !['type'].includes(k))
        .filter(([_k, v]) => !flags['hide-empty'] || !_.isEmpty(v) || (Array.isArray(v) && !(v.length === 0)))
        .map(([k, v]) => {
          return [
            { content: chalk.blueBright(k), hAlign: 'right', vAlign: 'center' },
            formatValue(k, v),
          ]
        }))

      this.log()
      this.log(table.toString())
      this.log()

      return webhook

    } catch (error) {
      this.printError(error)
    }

  }

}


const formatValue = (field: string, value: string): any => {

  switch (field) {

    case 'id': return chalk.bold(value)
    case 'topic': return chalk.magentaBright(value)
    case 'circuit_state': return ((value === 'closed') ? chalk.green : chalk.red)(value || '')
    case 'include_resources': return String(value || '').replace(/,/g, ' | ')
    case 'metadata': {
      const t = new Table({ style: { compact: false } })
      t.push(...Object.entries(value).map(([k, v]) => {
        return [
          { content: chalk.cyan.italic(k), hAlign: 'left', vAlign: 'center' },
          { content: chalk.italic((typeof v === 'object') ? JSON.stringify(v) : v) } as any,
        ]
      }))
      return t.toString()
    }
    default: {
      if ((typeof value === 'object') && (value !== null)) return JSON.stringify(value, undefined, 4)
      return String(value)
    }

  }

}
