import { Command, ux as cliux } from '@oclif/core'
import { clUtil, clColor, clFilter } from '@commercelayer/cli-core'



export default class ResourcesFilters extends Command {

  static description = 'show a list of all available filter predicates'

  static hidden: true

  static aliases = ['res:filters']

  static examples = [
    '$ commercelayer resources:filters',
    '$ cl res:filters',
  ]


  async run(): Promise<any> {

    this.log(clColor.style.title('\n-= Commerce Layer API available resource filters =-\n'))
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    cliux.Table.table(clFilter.filters().sort((a, b) => a.predicate.localeCompare(b.predicate)), {
      predicate: { header: 'PREDICATE', minWidth: 25, get: row => clColor.table.key(row.predicate) },
      description: { header: 'DESCRIPTION' },
    }, {
      printLine: clUtil.log,
    })

    this.log()

  }

}
