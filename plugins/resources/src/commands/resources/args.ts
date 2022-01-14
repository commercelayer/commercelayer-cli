import { Command, flags } from '@oclif/command'
import { findResource, Resource } from '../../util/resources'
import chalk from 'chalk'
import { deleteArgsFile, loadCommandData, readCommandArgs, ResourceOperation } from '../../commands'
import { formatOutput } from '../../output'
import cliux from 'cli-ux'
import { QueryParamsList } from '@commercelayer/sdk'
import { clOutput } from '@commercelayer/cli-core'


export default class ResourcesArgs extends Command {

  static description = 'show all the saved command arguments'

  static aliases = ['res:args']

  static flags = {
    alias: flags.string({
      char: 'a',
      description: 'the alias associated to saved command arguments',
      dependsOn: ['operation', 'resource'],
    }),
    resource: flags.string({
      char: 'r',
      description: 'the resource type',
    }),
    operation: flags.string({
      char: 'o',
      description: 'the resource operation',
      options: ['list', 'retrieve', 'create', 'update'],
    }),
    delete: flags.boolean({
      char: 'D',
      description: 'delete saved arguments associated to the alias',
      dependsOn: ['alias'],
    }),
    pretty: flags.boolean({
      char: 'P',
      description: 'show saved arguments in table format',
      hidden: true,
      exclusive: ['alias'],
    }),
  }


  async run() {

    const { flags } = this.parse(ResourcesArgs)

    const resource = flags.resource
    const alias = flags.alias
    const operation = flags.operation as ResourceOperation

    if (resource) this.checkResource(resource)

    this.log()

    if (alias) {

      if (!resource) this.error(`Flag ${chalk.bold('alias')} must be used in combination with a resource type`)

      const cmdData = loadCommandData(alias, this.config, resource, operation)
      if (cmdData) {
        if (flags.delete) {
          deleteArgsFile(cmdData.alias, this.config, cmdData.resource, cmdData.operation)
          this.log(`Deleted args with alias ${chalk.yellowBright()} for resource type ${chalk.yellowBright(cmdData.resource)} and operation ${chalk.yellowBright(cmdData.operation)}`)
        } else this.log(formatOutput(cmdData))
      } else this.log(`No saved arguments found with alias ${chalk.yellowBright(alias)} for resource type ${chalk.yellowBright(resource)} and operation ${chalk.yellowBright(operation)}`)

    } else {

      const commands = readCommandArgs(this.config, resource, operation)

      if (commands.length > 0) {

        if (flags.pretty) {
          cliux.table(commands.sort((a, b) => (a.resource + a.operation + a.alias).localeCompare(b.resource + b.operation + b.alias)), {
            resource: { header: 'RESOURCE', get: row => chalk.cyanBright(row.resource) },
            operation: { header: 'OPERATION', get: row => chalk.cyanBright(row.operation) },
            alias: { header: 'ALIAS', get: row => chalk.yellowBright(row.alias || '') },
            include: { header: 'INCLUDE', get: row => (row.params.include || []).sort().join('\n') },
            fields: { header: 'FIELDS', get: row => Object.keys((row.params.fields || {})).sort().join('\n') },
            filters: { header: 'FILTERS', get: row => Object.keys(((row.params as QueryParamsList).filters || {})).sort().join('\n') },
            sort: { header: 'SORT', get: row => Object.keys(((row.params as QueryParamsList).sort || {})).sort().join('\n') },
            pageSize: { header: 'PG. SIZE', get: row => (row.params as QueryParamsList).pageSize || '' },
            pageNumber: { header: 'PG. NUM.', get: row => (row.params as QueryParamsList).pageNumber || '' },
            savedAt: { header: 'SAVED AT', get: row => clOutput.cleanDate(row.saved_at) },
          }, {
            printLine: this.log,
          })
        } else {
          this.log(this.flagsMessageSuffix('Saved command arguments', resource, operation) + chalk.blueBright(' with ') + chalk.cyanBright('alias'))
          commands.forEach(c => {
            this.log(`\n${chalk.cyanBright(`\u002A  ${c.alias} [${c.operation}]`)}`)
            this.log(`${c.operation} ${c.argv.join(' ')}`)
          })
        }

      } else this.log(this.flagsMessageSuffix('No saved arguments found', resource, operation))

    }

    this.log()

  }


  private flagsMessageSuffix(message: string, resource?: string, operation?: ResourceOperation) {

    const f = resource || operation ? ' for ' : ''
    const a = resource && operation ? ' and ' : ''
    const res = resource ? `resource type ${chalk.yellowBright(resource)}` : ''
    const op = operation ? `operation ${chalk.yellowBright(operation)}` : ''

    return chalk.blueBright(`${message}${f}${res}${a}${op}`)

  }


  protected checkResource(res: string): Resource {
    const resource = findResource(res, { singular: false })
    if (resource === undefined) this.error(`Invalid resource ${chalk.redBright(res)}`,
      { suggestions: [`Execute command ${chalk.italic('resources')} to get a list of all available CLI resources`] }
    )
    return resource
  }

}
