import { BaseIdCommand } from '../../base'
import Table from 'cli-table3'
import { clOutput, clColor } from '@commercelayer/cli-core'
import type { CommandError } from '@oclif/core/lib/interfaces'



export default class TagsDetails extends BaseIdCommand {

  static description = 'show the details of an existing tag'

  static examples = [
    '$ commercelayer tags:details <tag-id/tag-name>'
  ]



  async run(): Promise<any> {

    const { args, flags } = await this.parse(TagsDetails)

    this.commercelayerInit(flags)

    const idName = args.id_name
    const tag = await this.checkTag(idName, true)
    if (!tag) this.exit()

    try {

      const table = new Table({
        // head: ['ID', 'Topic', 'Circuit state', 'Failures'],
        colWidths: [23, 67],
        colAligns: ['right', 'left'],
        wordWrap: true,
        wrapOnWordBoundary: true
      })

      const exclude = new Set(['type', 'reference_origin', 'metadata' ])

      // let index = 0
      table.push(...Object.entries(tag)
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

      return tag

    } catch (error) {
      this.handleError(error as CommandError, flags, idName)
    }

  }



  private formatValue(field: string, value: any): any {

    if (field.endsWith('_date') || field.endsWith('_at')) return clOutput.localeDate(value as string)

    switch (field) {

      case 'id': return clColor.api.id(value)
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
