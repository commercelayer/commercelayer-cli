import Command, { Args } from '../../base'
import Table from 'cli-table3'
import { clOutput, clColor, clText } from '@commercelayer/cli-core'
import type { CommandError } from '@oclif/core/lib/interfaces'



export default class ExportsDetails extends Command {

  static description = 'show the details of an existing export'

  static aliases = ['exp:details']

  static examples = [
    '$ commercelayer exports:details <export-id>',
    '$ cl exp:details <export-id>',
  ]


  static args = {
    id: Args.string({ name: 'id', description: 'unique id of the export', required: true, hidden: false }),
  }



  async run(): Promise<any> {

    const { args, flags } = await this.parse(ExportsDetails)

    const id = args.id

    this.commercelayerInit(flags)


    try {

      const exp = await this.cl.exports.retrieve(id)

      const table = new Table({
        // head: ['ID', 'Topic', 'Circuit state', 'Failures'],
        colWidths: [23, 67],
        colAligns: ['right', 'left'],
        wordWrap: true,
        wrapOnWordBoundary: true
      })

      const exclude = new Set(['type', 'reference', 'reference_origin', 'metadata', 'attachment_url'])

      // let index = 0
      table.push(...Object.entries(exp)
        .filter(([k]) => !exclude.has(k))
        .map(([k, v]) => {
          return [
            { content: clColor.table.key.blueBright(k), hAlign: 'right', vAlign: 'center' },
            this.formatValue(k, v),
          ]
        }))


      this.log()
      this.log(table.toString())
      this.log()

      if (exp.attachment_url) {
        const availableTime = new Date(/* exp?.completed_at || '' */)
        availableTime.setMinutes(availableTime.getMinutes() + 5)
        const clfun = (availableTime < new Date()) ? clColor.msg.error : clColor.msg.success
        this.log(`${clColor.style.title('Attachment URL')} (${clText.symbols.clock.stopwatch} Available until ${clfun(clOutput.localeDate(availableTime.toISOString()))})`)
        this.log(clColor.cli.value(exp.attachment_url))
        this.log()
      }

      return exp

    } catch (error) {
      this.handleError(error as CommandError, flags, id)
    }

  }



  private formatValue(field: string, value: any): any {

    if (field.endsWith('_date') || field.endsWith('_at')) return clOutput.localeDate(value as string)

    switch (field) {

      case 'id': return clColor.api.id(value)
      case 'resource_type': return clColor.magentaBright(value)
      case 'topic': return clColor.magenta(value)
      case 'status': return this.exportStatus(value as string)
      case 'records_count': return clColor.yellowBright(value)
      case 'errors_count': return clColor.msg.error(value)
      case 'dry_data': return (value ? clText.symbols.check.small : '')
      case 'includes': return (value as string[]).join(', ')
      case 'filters':
      case 'metadata': {
        const t = new Table({ style: { compact: false } })
        t.push(...Object.entries(value as object).map(([k, v]) => {
          return [
            { content: clColor.cyan.italic(k), hAlign: 'left', vAlign: 'center' },
            { content: clColor.cli.value((typeof v === 'object') ? JSON.stringify(v) : v) } as any,
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

}
