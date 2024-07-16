import { Command, Flags, ux as cliux } from '@oclif/core'
import { findResource, type ApiResource } from '../../util/resources'
import { deleteArgsFile, loadCommandData, readCommandArgs, type ResourceOperation } from '../../commands'
import { formatOutput } from '../../output'
import type { QueryParamsList } from '@commercelayer/sdk'
import { clOutput, clUtil, clColor } from '@commercelayer/cli-core'


export default class ResourcesArgs extends Command {

  static description = 'show all the saved command arguments'

  static aliases = ['res:args']

  static flags = {
    alias: Flags.string({
      char: 'a',
      description: 'the alias associated to saved command arguments',
      dependsOn: ['operation', 'resource']
    }),
    resource: Flags.string({
      char: 'r',
      description: 'the resource type'
    }),
    operation: Flags.string({
      char: 'o',
      description: 'the resource operation',
      options: ['list', 'retrieve', 'create', 'update']
    }),
    delete: Flags.boolean({
      char: 'D',
      description: 'delete saved arguments associated to the alias',
      dependsOn: ['alias']
    }),
    pretty: Flags.boolean({
      char: 'P',
      description: 'show saved arguments in table format',
      hidden: true,
      exclusive: ['alias']
    })
  }


  async run(): Promise<any> {

    const { flags } = await this.parse(ResourcesArgs)

    const resource = flags.resource
    const alias = flags.alias
    const operation = flags.operation as ResourceOperation

    if (resource) this.checkResource(resource)

    this.log()

    if (alias) {

      if (!resource) this.error(`Flag ${clColor.style.flag('alias')} must be used in combination with a resource type`)

      const cmdData = loadCommandData(alias, this.config, resource, operation)
      if (cmdData) {
        if (flags.delete) {
          deleteArgsFile(cmdData.alias, this.config, cmdData.resource, cmdData.operation)
          this.log(`Deleted args with alias ${clColor.yellowBright()} for resource type ${clColor.style.resource(cmdData.resource)} and operation ${clColor.yellowBright(cmdData.operation)}`)
        } else this.log(formatOutput(cmdData))
      } else this.log(`No saved arguments found with alias ${clColor.yellowBright(alias)} for resource type ${clColor.style.resource(resource)} and operation ${clColor.yellowBright(operation)}`)

    } else {

      const commands = readCommandArgs(this.config, resource, operation)

      if (commands.length > 0) {

        if (flags.pretty) {
          cliux.Table.table(commands.sort((a, b) => (a.resource + a.operation + a.alias).localeCompare(b.resource + b.operation + b.alias)), {
            resource: { header: 'RESOURCE', get: row => clColor.cyanBright(row.resource) },
            operation: { header: 'OPERATION', get: row => clColor.cyanBright(row.operation) },
            alias: { header: 'ALIAS', get: row => clColor.yellowBright(row.alias || '') },
            include: { header: 'INCLUDE', get: row => (row.params.include || []).sort().join('\n') },
            fields: { header: 'FIELDS', get: row => Object.keys((row.params.fields || {})).sort().join('\n') },
            filters: { header: 'FILTERS', get: row => Object.keys(((row.params as QueryParamsList).filters || {})).sort().join('\n') },
            sort: { header: 'SORT', get: row => Object.keys(((row.params as QueryParamsList).sort || {})).sort().join('\n') },
            pageSize: { header: 'PG. SIZE', get: row => (row.params as QueryParamsList).pageSize || '' },
            pageNumber: { header: 'PG. NUM.', get: row => (row.params as QueryParamsList).pageNumber || '' },
            savedAt: { header: 'SAVED AT', get: row => clOutput.cleanDate(row.saved_at) },
          }, {
            printLine: clUtil.log,
          })
        } else {
          this.log(this.flagsMessageSuffix('Saved command arguments', resource, operation) + clColor.style.title(' with alias'))
          commands.forEach(c => {
            this.log(`\n${clColor.cyanBright(`\u002A  ${c.alias} [${c.operation}]`)}`)
            this.log(`${c.operation} ${c.argv.join(' ')}`)
          })
        }

      } else this.log(this.flagsMessageSuffix('No saved arguments found', resource, operation))

    }

    this.log()

  }


  private flagsMessageSuffix(message: string, resource?: string, operation?: ResourceOperation): string {

    const f = resource || operation ? ' for ' : ''
    const a = resource && operation ? ' and ' : ''
    const res = resource ? `resource type ${clColor.style.resource.yellowBright(resource)}` : ''
    const op = operation ? `operation ${clColor.yellowBright.bold(operation)}` : ''

    return clColor.style.title(`${message}${f}${res}${a}${op}`)

  }


  protected checkResource(res: string): ApiResource {
    const resource = findResource(res, { singular: false })
    if (resource === undefined) this.error(`Invalid resource ${clColor.style.error(res)}`,
      { suggestions: [`Execute command ${clColor.style.command('resources')} to get a list of all available CLI resources`] }
    )
    return resource
  }

}
