import { Flags } from '@oclif/core'
import { BaseIdCommand } from '../../base'
import Table from 'cli-table3'
import isEmpty from 'lodash.isempty'
import { clColor } from '@commercelayer/cli-core'
import { formatDate, linkStatus } from '../../util'
import type { Link } from '@commercelayer/sdk'


export default class LinksDetails extends BaseIdCommand {

  static override description = 'show link details'

  static aliases = ['links:show', 'links:get']

  static override examples = [
    '$ commercelayer links:details <link-id>',
    '$ cl links:details <link-id> -H',
    '$ cl links:show <link-id>'
  ]

  static override flags = {
    'hide-empty': Flags.boolean({
      char: 'H',
      description: 'hide empty attributes'
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

  static override args = {
    ...BaseIdCommand.args
  }



  public async run(): Promise<void> {

    const { args, flags } = await this.parse(LinksDetails)

    const id = args.id

    this.commercelayerInit(flags)

    const link = await this.cl.links.retrieve(id, {
      include: ['item'],
      fields: { orders: ['id'], sku_lists: ['id'], bundles: ['id'] }
    }).catch(err => {
      if (this.cl.isApiError(err) && (err.status === 404)) {
        this.log(`\nLink ${clColor.api.id(id)} not found\n`)
        this.exit()
      }
    })
    if (!link) return


    const table = new Table({
      colWidths: [18, 72],
      wordWrap: true
    })


    table.push(...Object.entries(link)
      .filter(([k]) => !['type'].includes(k))
      .filter(([_k, v]) => !flags['hide-empty'] || !isEmpty(v) || (Array.isArray(v) && (v.length > 0)))
      .map(([k, v]: [string, string]) => {
        return [
          { content: clColor.table.key(k), hAlign: 'right', vAlign: 'center' },
          formatValue(k, v, { locale: flags.locale }),
        ]
      }))

    this.log()
    this.log(table.toString())
    this.log()

  }

}


const formatValue = (field: string, value: string, options: { locale?: boolean } = {}): any => {

  if (field.endsWith('_date') || field.endsWith('_at')) return formatDate(value, options.locale)

  switch (field) {

    case 'id': return clColor.api.id(value)
    case 'name': return clColor.magentaBright(value)
    case 'active': return (value ? clColor.msg.success : clColor.msg.error)(value || '')
    case 'status': return linkStatus(value as Link['status'])
    case 'domain': return clColor.cyanBright(value || '')
    case 'url': return clColor.underline.italic(value || '')
    case 'item':
    case 'metadata': {
      const t = new Table({ style: { compact: false } })
      t.push(...Object.entries(value).sort((a, b) => {
        const ka = a[0]
        const kb = b[0]
        if (ka === 'type') return -1
        if (kb === 'type') return 1
        if (ka === 'id') return -1
        if (kb === 'id') return 1
        return ka.localeCompare(kb)
      }).map(([k, v]) => {
        return [
          { content: clColor.cyan.italic(k), hAlign: 'left', vAlign: 'center' },
          { content: clColor.italic((typeof v === 'object') ? JSON.stringify(v) : v) } as any,
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
