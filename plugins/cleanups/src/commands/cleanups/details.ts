import Command, { Flags, Args } from '../../base'
import Table from 'cli-table3'
import { clOutput, clColor, clText } from '@commercelayer/cli-core'



export default class CleanupsDetails extends Command {

  static description = 'show the details of an existing cleanup'

  static aliases = ['clp:details']

  static examples = [
    '$ commercelayer cleanups:details <cleanup-id>',
    '$ cl clp:details <cleanup-id>',
  ]


  static flags = {
    logs: Flags.boolean({
      char: 'l',
      description: 'show error logs related to the cleanup process',
    }),
  }


  static args = {
    id: Args.string({ name: 'id', description: 'unique id of the cleanup', required: true, hidden: false }),
  }



  async run(): Promise<any> {

    const { args, flags } = await this.parse(CleanupsDetails)

    const id = args.id

    const cl = this.commercelayerInit(flags)


    try {

      const clp = await cl.cleanups.retrieve(id)

      const table = new Table({
        // head: ['ID', 'Topic', 'Circuit state', 'Failures'],
        colWidths: [23, 67],
        colAligns: ['right', 'left'],
        wordWrap: true,
        wrapOnWordBoundary: true
      })

      const exclude = new Set(['type', 'reference', 'reference_origin', 'metadata', 'errors_log'])

      // let index = 0
      table.push(...Object.entries(clp)
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

      if (flags.logs) this.showLogs(clp.errors_log)


      return clp

    } catch (error: any) {
      this.handleError(error, flags, id)
    }

  }


  private formatValue(field: string, value: any): any {

    if (field.endsWith('_date') || field.endsWith('_at')) return clOutput.localeDate(value)

    switch (field) {

      case 'id': return clColor.api.id(value)
      case 'resource_type': return clColor.magentaBright(value)
      case 'topic': return clColor.magenta(value)
      case 'status': return this.cleanupStatus(value)
      case 'records_count': return clColor.yellowBright(value)
      case 'errors_count': return clColor.msg.error(value)
      case 'dry_data': return (value ? clText.symbols.check.small : '')
      case 'includes': return (value as string[]).join(', ')
      case 'filters':
      case 'metadata': {
        const t = new Table({ style: { compact: false } })
        t.push(...Object.entries(value).map(([k, v]) => {
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


  private showLogs(errorLog?: Record<string, any> | null): void {

    const tableOptions: Table.TableConstructorOptions = {
      head: ['Code', 'Message'],
      colWidths: [15, 75],
      // colAligns: ['center', 'left'],
      wordWrap: true,
      style: {
        head: ['brightCyan'],
        compact: false,
      },
    }


    // Errors
    const errors = errorLog ? Object.keys(errorLog).length : 0

    this.log()
    this.log(clColor.msg.error(`${clColor.bold('ERROR LOG')}\t[ ${errors} error${errors === 1 ? '' : 's'} ]`))

    if (errors > 0) {
      const table = new Table(tableOptions)
      table.push(...(Object.entries(errorLog || {}))
        .map(([k, v]) => [{ content: ((k && (k !== 'unknown')) ? k : ''), vAlign: 'center' }, clOutput.printObject(v) as any]))
      this.log(table.toString())
    }

    this.log()

  }

}
