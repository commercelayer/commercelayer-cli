import { Command, flags } from '@oclif/command'
import { findResource, Resource } from '../../util/resources'
import chalk from 'chalk'
import { deleteArgsFile, loadCommandData, readCommandArgs } from '../../commands'
import { formatOutput } from '../../output'
import cliux from 'cli-ux'
import { QueryParamsList } from '@commercelayer/sdk'
import { cleanDate } from '../../common'


export default class ResourcesArgs extends Command {

  static description = 'show all the saved command arguments'

  static aliases = ['res:args']

  static flags = {
    alias: flags.string({
      char: 'a',
      description: 'the alias associated to saved command arguments',
    }),
    delete: flags.boolean({
      char: 'D',
      description: 'delete saved arguments associated to the alias',
      dependsOn: ['alias'],
    }),
  }

  static args = [
    { name: 'resource', description: 'the resource type', required: false },
  ]


  async run() {

    const { args, flags } = this.parse(ResourcesArgs)

    const resource = args.resource
    const alias = flags.alias

    if (resource) this.checkResource(resource)

    this.log()

    if (alias) {

      if (!resource) this.error(`Flag ${chalk.bold('alias')} must be used in combination with a resource type`)

      const cmdData = loadCommandData(alias, resource, this.config)
      if (cmdData) {
        this.log(formatOutput(cmdData))
        if (flags.delete) {
          deleteArgsFile(resource, alias, this.config)
          this.log(`Deleted args ${chalk.yellowBright(alias)}`)
        }
      } else this.log(`No saved args found with alias ${chalk.yellowBright(alias)} for the resource type ${chalk.yellowBright(resource)}`)

    } else {

      const commands = readCommandArgs(this.config, resource)

      if (commands.length > 0) {

        cliux.table(commands.sort((a, b) => (a.resource + a.alias).localeCompare(b.resource + b.alias)), {
          resource: { header: 'RESOURCE', get: row => chalk.cyanBright(row.resource) },
          alias: { header: 'ALIAS', get: row => chalk.yellowBright(row.alias || '') },
          include: { header: 'INCLUDE', get: row => (row.params.include || []).sort().join('\n') },
          fields: { header: 'FIELDS (OF)', get: row => Object.keys((row.params.fields || {})).sort().join('\n') },
          filters: { header: 'FILTERS (ON)', get: row => Object.keys(((row.params as QueryParamsList).filters || {})).sort().join('\n') },
          sort: { header: 'SORT (BY)', get: row => Object.keys(((row.params as QueryParamsList).sort || {})).sort().join('\n') },
          pageSize: { header: 'PG. SIZE', get: row => (row.params as QueryParamsList).pageSize || ''},
          pageNumber: { header: 'PG. NUM.', get: row => (row.params as QueryParamsList).pageNumber || '' },
          savedAt: { header: 'SAVED AT', get: row => cleanDate(row.saved_at) },
        }, {
          printLine: this.log,
        })

      } else this.log(`No saved args found${resource ? ` for the resource type ${chalk.yellowBright(resource)}` : ''}`)

    }

    this.log()

  }


  checkResource(res: string): Resource {
    const resource = findResource(res, { singular: false })
    if (resource === undefined) this.error(`Invalid resource ${chalk.redBright(res)}`,
      { suggestions: [`Execute command ${chalk.italic('resources')} to get a list of all available CLI resources`] }
    )
    return resource
  }

}
