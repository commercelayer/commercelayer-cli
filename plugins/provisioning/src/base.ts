import { Command, Flags, Args, ux as cliux } from '@oclif/core'
import { findResource, type Resource } from './util/resources'
import { formatOutput, exportOutput } from './output'
import { exportCsv } from './csv'
import { existsSync } from 'fs'
import commercelayer, { type CommerceLayerProvisioningClient, CommerceLayerProvisioningStatic } from '@commercelayer/provisioning-sdk'
// import { availableLanguages, buildCommand, getLanguageArg, languageInfo, promptLanguage, type RequestData } from './lang'
import { clToken, clUpdate, clColor, clUtil, clCommand, clFilter, clText } from '@commercelayer/cli-core'
import type { KeyValRel, KeyValObj, KeyValArray, KeyValString, KeyValSort, ResAttributes, KeyVal } from '@commercelayer/cli-core'
import type { CommandError } from '@oclif/core/lib/interfaces'
import type { Package } from '@commercelayer/cli-core/lib/cjs/update'
// import { aliasExists, checkAlias, type CommandParams, loadCommandData, type ResourceOperation, saveCommandData } from './commands'
// import type { ResourceId, ResourceType } from '@commercelayer/provisioning-sdk/lib/cjs/resource'



const pkg = require('../package.json')


// export const FLAG_SAVE_PARAMS = 'save-args'
// export const FLAG_LOAD_PARAMS = 'load-args'


export abstract class BaseCommand extends Command {

  static baseFlags = {
    domain: Flags.string({
      char: 'd',
      required: false,
      hidden: true,
      env: 'CL_CLI_DOMAIN',
    }),
    accessToken: Flags.string({
      hidden: true,
      required: true,
      env: 'CL_CLI_ACCESS_TOKEN',
    })
  }


  protected checkApplication(accessToken: string, kinds: string[]): boolean {

    const info = clToken.decodeAccessToken(accessToken)

    if (info === null) this.error('Invalid access token provided')
    else
      if (!kinds.includes(info.application.kind))
        this.error(`Invalid application kind: ${clColor.msg.error(info.application.kind)}. Application kind must be one of the following: ${clColor.cyanBright(kinds.join(', '))}`)

    return true

  }


  checkResourceId(resource: string, resourceId?: string, required = true): {
      res: string,
      id?: string, singleton: boolean
    } {

    let res = resource
    let id = resourceId

    const si = res.indexOf('/')
    if (si >= 0) {
      const rt = res.split('/')
      if (id && rt[1]) this.error(`Double definition of resource id: [${res}, ${id}]`,
        { suggestions: [`Define resource id as command argument (${clColor.italic(id)}) or as part of the resource itself (${clColor.italic(res)}) but not both`] }
      )
      else id = rt[1]
      res = rt[0]
    }

    const res_ = findResource(res, { singular: true })
    const singleton = res_?.singleton || false

    if (id) {
      if (singleton) this.error(`Singleton resource ${clColor.api.resource(res)} does not require id`)
      if (id.includes('/')) this.error(`Invalid resourde id: ${clColor.msg.error(id)}`)
    } else if (required && !singleton) this.error('Resource id not defined')

    return {
      res,
      id,
      singleton,
    }

  }


  checkResource(res: string, { required = true, singular = false } = {}): Resource {
    if (!res && required) this.error('Resource type not defined')
    const resource = findResource(res, { singular })
    if (resource === undefined) this.error(`Invalid resource ${clColor.style.error(res)}`,
      { suggestions: [`Execute command ${clColor.style.command('resources')} to get a list of all available CLI resources`] }
    )
    return resource
  }


  protected initCommerceLayer(flags: any, ...options: any[]): CommerceLayerProvisioningClient {


    const domain = flags.domain
    const accessToken = flags.accessToken
    const userAgent = clUtil.userAgent(this.config)


    const cl = commercelayer({ domain, accessToken, userAgent, ...options })

    if ('cl' in this) this.cl = cl

    return cl

  }


  protected checkOperation(sdk: any, name: string, attributes?: ResAttributes): boolean {
    if (!sdk[name]) {
      // resource attributes reference, reference_origin and metadata are always updatable
      if ((name === 'update') && attributes) {
        if (!Object.keys(attributes).some(attr => !['reference', 'reference_origin', 'metadata'].includes(attr))) return true
      }
      this.error(`Operation not supported for resource ${clColor.api.resource(sdk.type())}: ${clColor.msg.error(name)}`)
    }
    return true
  }


  printOutput(output: any, flags: any | undefined): void {
    if (output && !flags['headers-only']) this.log(formatOutput(output, flags))
  }


  printHeaders(headers: any, flags: any): void {
    if (headers) {
      if (flags.headers || flags['headers-only']) {
        this.log('---------- Response Headers ----------')
        if (Object.keys(headers as object).length === 0) this.log(clColor.italic('No headers'))
        else this.log(formatOutput(headers, flags))
        this.log('---------- ---------------- ----------')
      }
    }
  }


  printError(error: any, flags?: any, args?: any): void {

    let err = error

    if (CommerceLayerProvisioningStatic.isApiError(err)) {
      err = err.errors || `Unable to find resource of type ${clColor.msg.error(args.resource)} and id ${clColor.msg.error(args.id)}`
    } else
      if (error.response) {
        if (error.response.status === 401) this.error(clColor.bg.red(`${error.response.statusText} [${error.response.status}]`),
          { suggestions: ['Execute login to get access to the selected resource'] }
        )
        else
          if (error.response.status === 500) this.error(`We're sorry, but something went wrong (${error.response.status})`)
          else
            if (error.response.status === 429) this.error(`You have done too many requests in the last 5 minutes (${error.response.status})`)
            else err = error.response.data.errors
      } else
        if (error.message) err = error.message


    this.error(formatOutput(err, flags))

  }


  _keyvalFlag(flag: string[] | undefined, type = 'attribute'): KeyValString {

    const param: KeyValString = {}

    if (flag && (flag.length > 0)) {
      flag.forEach(f => {

        const eqi = f.indexOf('=')
        if (eqi < 1) this.error(`Invalid ${type.toLowerCase()} ${clColor.msg.error(f)}`, {
          suggestions: [`${clText.capitalize(type)} flags must be defined using the format ${clColor.cli.value('name=value')}`],
        })

        const name = f.substr(0, eqi)
        const value = f.substr(eqi + 1)

        if (param[name]) this.warn(`${clText.capitalize(type)} ${clColor.msg.warning(name)} has already been defined`)

        param[name] = value

      })
    }

    return param

  }


  attributeFlag(flag: string[] | undefined): ResAttributes {
    const attr = this._keyvalFlag(flag, 'attribute')
    const attributes: ResAttributes = {}
    Object.entries(attr).forEach(([k, v]) => {
      attributes[k] = (v === 'null') ? null : v
    })
    return attributes
  }

}


export abstract class BaseFilterCommand extends BaseCommand {

  static flags = {
    include: Flags.string({
      char: 'i',
      multiple: true,
      description: 'comma separated resources to include',
    }),
    fields: Flags.string({
      char: 'f',
      multiple: true,
      description: 'comma separeted list of fields in the format [resourceType/]field1,field2...',
    }),
    json: Flags.boolean({
      char: 'j',
      description: 'convert output in standard JSON format',
    }),
    unformatted: Flags.boolean({
      char: 'u',
      description: 'print unformatted JSON output',
      dependsOn: ['json'],
    }),
    raw: Flags.boolean({
      char: 'R',
      description: 'print out the raw API response',
      hidden: false,
    }),
    /*
    doc: Flags.boolean({
      description: 'show the CLI command in a specific language',
      exclusive: ['raw'],
      helpGroup: 'documentation',
    }),
    lang: Flags.string({
      char: 'l',
      description: 'show the CLI command in the specified language syntax',
      exclusive: availableLanguages,
      options: availableLanguages,
      dependsOn: ['doc'],
      helpGroup: 'documentation',
    }),
    curl: Flags.boolean({
      description: `show the equivalent ${languageInfo.curl.label} of the CLI command`,
      exclusive: ['lang', ...availableLanguages.filter(l => l !== 'curl')],
      parse: async (): Promise<string> => await Promise.resolve('curl'),
      hidden: !availableLanguages.includes('curl'),
      dependsOn: ['doc'],
      helpGroup: 'documentation',
    }),
    node: Flags.boolean({
      description: `show the equivalent ${languageInfo.node.label} of the CLI command`,
      exclusive: ['lang', ...availableLanguages.filter(l => l !== 'node')],
      parse: async (): Promise<string> => await Promise.resolve('node'),
      hidden: !availableLanguages.includes('node'),
      dependsOn: ['doc'],
      helpGroup: 'documentation',
    }),
    [FLAG_SAVE_PARAMS]: Flags.string({
      description: 'save command data to file for future use',
    }),
    [FLAG_LOAD_PARAMS]: Flags.string({
      description: 'load previously saved command arguments',
    }),
    */
    headers: Flags.boolean({
      char: 'H',
      description: 'show response headers',
      dependsOn: ['raw'],
      exclusive: ['headers-only'],
    }),
    'headers-only': Flags.boolean({
      char: 'Y',
      description: 'show only response headers',
      dependsOn: ['raw'],
      exclusive: ['headers', 'fields', 'include'],
    }),
  }


  // INIT (override)
  async init(): Promise<any> {
    // Check for plugin updates only if in visible mode
    if (!this.argv.includes('--blind') && !this.argv.includes('--silent') && !this.argv.includes('--quiet')) clUpdate.checkUpdate(pkg as Package)
    return await super.init()
  }


  // CATCH (override)
  async catch(error: CommandError): Promise<any> {
    if (error.message?.match(/Missing \d required args?:\nresource/))
      this.error(`Missing argument ${clColor.style.error('resource')}`,
        { suggestions: [`Execute command ${clColor.style.command('resources')} to get a list of all available Provisioning resources`] }
      )
    // else throw error				// overwrite command catch method
    else return await super.catch(error)	// extend command catch method
  }



  // -- CUSTOM METHODS -- //


  includeFlag(flag: string[] | undefined, relationships?: KeyValRel, force?: boolean): string[] {

    const values: string[] = []

    if (flag) {
      const flagValues = flag.map(f => f.split(',').map(t => t.trim()))
      flagValues.forEach(a => values.push(...a))
      if (values.some(f => f.split('.').length > 3) && !force) this.error('Can be only included resources within the 3rd level of depth')
    }

    if (relationships) {
      Object.keys(relationships).forEach(r => {
        if (!values.includes(r)) values.push(r)
      })
    }

    return values

  }


  objectFlag(flag: string[] | undefined): KeyValObj {

    const objects: KeyValObj = {}

    if (flag && (flag.length > 0)) {
      flag.forEach(f => {

        const slashSep = f.indexOf('/')
        if (slashSep < 0) this.error(`No name or fields defined in flag object${clColor.style.flag(f)}`)

        const name = f.substring(0, slashSep)
        if (name === '') this.error(`No name defined in flag object ${f}`)
        const fields = f.substring(slashSep + 1).split(/(?<!\\),/g).map(v => v.trim())  // escape ',' in value with \\ (double back slash)
        if (fields[0].trim() === '') this.error(`No fields defined for object field ${clColor.style.attribute(name)}`)

        const obj: KeyValObj = {}

        fields.forEach(f => {

          const eqi = f.indexOf('=')
          if (eqi < 0) this.error(`No value defined for object field ${clColor.style.attribute(f)} of object ${clColor.style.attribute(name)}`)

          const n = f.substring(0, eqi)
          const v = f.substring(eqi + 1).replace(/\\,/g, ',')

          obj[n] = clCommand.fixValueType(v)

        })

        if (objects[name] === undefined) objects[name] = {}
        objects[name] = { ...objects[name], ...obj }

      })
    }

    return objects

  }


  fieldsFlag(flag: string[] | undefined, type: string): KeyValArray {

    const fields: KeyValArray = {}

    if (flag && (flag.length > 0)) {
      flag.forEach(f => {

        let res = type
        let val = f

        if (f.includes('/')) {

          const kv = f.split('/')

          if (kv.length > 2) this.error('Can be defined only one resource for each fields flag',
            { suggestions: [`Split the value ${clColor.style.attribute(f)} into two fields flags`] }
          )

          res = kv[0].replace('[', '').replace(']', '')
          this.checkResource(res)

          val = kv[1]

        }

        const values = val.split(',').map(v => v.trim())
        if (values[0].trim() === '') this.error(`No fields defined for resource ${clColor.api.resource(res)}`)

        if (fields[res] === undefined) fields[res] = []
        fields[res].push(...values)

      })
    }

    return fields

  }


  whereFlag(flag: string[] | undefined): KeyValString {

    const wheres: KeyValString = {}

    if (flag && (flag.length > 0)) {
      flag.forEach(f => {

        const wt = f.split('=')
        if (wt.length < 2) this.error(`Filter flag must be in the form ${clColor.style.attribute('predicate=value')}`)
        const w = wt[0]
        if (!clFilter.available(w)) this.error(`Invalid query filter: ${clColor.style.error(w)}`, {
          suggestions: [`Execute command ${clColor.style.command('resources:filters')} to get a full list of all available filter predicates`],
          ref: 'https://docs.commercelayer.io/api/filtering-data#list-of-predicates',
        })

        const v = wt[1]

        wheres[w] = v

      })
    }

    return wheres

  }


  sortFlag(flag: string[] | undefined): KeyValSort {

    const sort: KeyValSort = {}

    if (flag && (flag.length > 0)) {

      if (flag.some(f => {
        const ft = f.split(',')
        return (ft.includes('asc') || ft.includes('desc'))
      })) {
        flag.forEach(f => {

          const ot = f.split(',')
          if (ot.length > 2) this.error('Can be defined only one field for each sort flag',
            { suggestions: [`Split the value ${clColor.style.attribute(f)} into two or more sort flags`] }
          )

          const of = ot[0]
          if (of.startsWith('-')) this.error('You cannot mix two ordering syntaxes',
            { suggestions: [`Choose between the style ${clColor.cli.value('<field>,<order>')} and the style ${clColor.cli.value('[-]<field>')}`] }
          )
          const sd = ot[1] || 'asc'
          if (!['asc', 'desc'].includes(sd)) this.error(`Invalid sort flag: ${clColor.msg.error(f)}`,
            { suggestions: [`Sort direction can assume only the values ${clColor.cli.value('asc')} or ${clColor.cli.value('desc')}`] }
          )

          sort[of] = sd as 'asc' | 'desc'

        })
      } else {
        flag.forEach(fl => {
          fl.split(',').forEach(f => {
            const desc = f.startsWith('-')
            const of = desc ? f.slice(1) : f
            const sd = desc ? 'desc' : 'asc'
            sort[of] = sd
          })
        })
      }
    }

    return sort

  }


  metadataFlag(flag: string[] | undefined, { fixTypes = false } = {}): KeyVal {
    const md = this._keyvalFlag(flag, 'metadata')
    const metadata: KeyVal = {}
    Object.keys(md).forEach(k => {
      metadata[k] = fixTypes ? clCommand.fixValueType(md[k]) : md[k]
    })
    return metadata
  }


  relationshipFlag(flag: string[] | undefined): KeyValRel {

    const relationships: KeyValRel = {}

    if (flag && (flag.length > 0)) {
      flag.forEach(f => {

        let rel: string
        let name: string
        let id: string
        let type: string

        const rt = f.split('=')
        if (rt.length === 2) {
          if ((name = rt[0]) === '') this.error('Relationship attribute name is empty')
          if ((rel = rt[1]) === '') this.error('Relationship value is empty')
        } else this.error(`Invalid relationship flag: ${clColor.msg.error(f)}`,
          { suggestions: [`Define the relationship using the format ${clColor.cli.value('attribute_name=resource_type/resource_id')}`] }
        )

        const vt = rel.split('/')
        if (vt.length === 2) {
          if ((type = vt[0]) === '') this.error('Relationship type is empty')
          if ((id = vt[1]) === '') this.error('Relationship resource id is empty')
        } else {
          id = vt[0]
          const res = findResource(name, { singular: true })
          if (res) type = res.api
          else this.error('Relationship type is empty')
        }

        // const res = this.checkResource(type)

        if (relationships[name]) this.warn(`Relationship ${clColor.yellow(name)} has already been defined`)

        relationships[name] = { id, type }

      })
    }

    return relationships

  }



  extractFlag(flag: string[],): KeyValArray {

    const extract: KeyValArray = {}

    if (flag && (flag.length > 0)) {
      flag.forEach(f => {

        const kv = f.split('/')

        if (kv.length > 2) this.error('Can be defined only one field for each extract flag',
          { suggestions: [`Split the value ${clColor.cli.value(f)} into two extract flags`] }
        )
        else
          if (kv.length === 1) this.error(`No fields defined for object ${clColor.cli.value(kv[0])}`)

        const name = kv[0]
        if (name === '') this.error(`No name defined in flag extract ${f}`)
        if (kv[1].trim() === '') this.error(`No fields defined for object ${clColor.cli.value(kv[0])}`)

        const fields = kv[1].split(/(?<!\\),/g).map(v => v.trim())  // escape ',' in value with \\ (double back slash)
        if (fields[0].trim() === '') this.error(`No fields defined for object field ${clColor.cli.value(name)}`)

        if (extract[name] === undefined) extract[name] = []
        extract[name].push(...fields)

      })

    }

    return extract

  }


  extractObjectFields(fields: KeyValArray, obj: any): void {

    Object.entries(fields).forEach(([extObj, extFields]) => {

      const objPath = extObj.split('.')
      let curObj = obj

      for (const op of objPath) {
        if (curObj) curObj = curObj[op] // if not undefined go to next level object
        else break  // if undefined stop search in depth
      }

      // if leaf field is an object and it is not a relationship then extract its fields
      if (curObj && (typeof curObj === 'object') && !curObj.id && !curObj.type)
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        for (const k of Object.keys(curObj as object)) if (!extFields.includes(k)) delete curObj[k]

    })

  }


  saveOutput(output: any, flags: any): void {

    try {

      let filePath: string = flags.save || flags['save-path']
      if (!filePath) this.warn('Undefined output save path')

      filePath = clUtil.specialFolder(filePath, flags['save-path'] as boolean)

      const fileExport = flags.csv ? exportCsv : exportOutput
      fileExport(output, flags, filePath)
        .then(() => {
          if (existsSync(filePath)) this.log(`Command output saved to file ${clColor.style.path(filePath)}\n`)
        })
        .catch(() => this.error(`Unable to save command output to file ${clColor.style.path(filePath)}`,
          { suggestions: ['Please check you have the right file system permissions'] }
        ))

    } catch (error: any) {
      if (error.code === 'ENOENT') this.warn(`Path not found ${clColor.msg.error(error.path)}: execute command with flag ${clColor.cli.flag('-X')} to force path creation`)
      else throw error
    } finally {
      this.log()
    }

  }

/*
  protected async showLiveDocumentation(request: RequestData, params?: QueryParams, flags?: any): Promise<string> {
    const lang = getLanguageArg(flags) || await promptLanguage()
    const cmd = buildCommand(lang, request, params, flags)
    this.printCommand(lang, cmd)
    return cmd
  }
*/
/*
  protected printCommand(lang: string, command: string): void {

    const header = languageInfo[lang as keyof typeof languageInfo].label
    // const footer = header.replace(/./g, '-')

    this.log()
    this.log(`${clColor.underline.cyan(header)}`)
    // this.log(chalk.cyan(`------------------------------{ ${header} }------------------------------`))
    this.log()
    this.log(command)
    // this.log()
    // this.log(chalk.cyan(`---------------------------------${footer}---------------------------------`))
    this.log()

  }
*/

/*
  protected checkAlias(alias: string, resource: string, operation: ResourceOperation, config: Config): void {
    let ok = false
    try {
      ok = checkAlias(alias)
    } catch (error) {
      this.printError(error)
    }
    if (ok && aliasExists(alias, config, resource, operation))
      this.error(`Alias already used for resource type ${clColor.yellowBright(resource)} and operation ${clColor.yellowBright(operation)}: ${clColor.msg.error(alias)}`)
  }
*/
/*
  protected saveParams = (alias: string, resource: ResourceType | ResourceId, operation: ResourceOperation, params: QueryParams): void => {

    const toBeRemoved = [`--${FLAG_SAVE_PARAMS}`, `--${FLAG_LOAD_PARAMS}`, '--accessToken', '-o', '--organization', '-d', '--domain']

    const argvList = [...this.argv].filter(a => !toBeRemoved.some(r => a.startsWith(`${r}=`)))

    let idx: number
    toBeRemoved.forEach(tbr => {
      if ((idx = argvList.indexOf(tbr)) > -1) argvList.splice(idx, 2)
    })


    const data: CommandParams = {
      alias,
      command: this.ctor.id,
      id: (resource as ResourceId).id,
      resource: resource.type,
      operation,
      argv: argvList,
      params,
      saved_at: new Date().toISOString(),
    }

    saveCommandData(alias, this.config, data)

  }
*/
/*
  protected loadParams(alias: string, resource: string, operation: ResourceOperation): QueryParams {

    const cmdData = loadCommandData(alias, this.config, resource, operation)
    if (!cmdData) this.error(`No command arguments saved with alias ${clColor.msg.error(alias)} for resource type ${clColor.yellowBright(resource)} and operation ${clColor.yellowBright(operation)}`)

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const queryParams: QueryParams = (operation && ['list', 'relationship'].includes(operation)) ? cmdData.params : {
      include: cmdData.params.include,
      fields: cmdData.params.fields,
    } as QueryParamsRetrieve

    return queryParams

  }
*/
}


export default abstract class extends BaseFilterCommand {

  static args = {
    resource: Args.string({ name: 'resource', description: 'the resource type', required: true }),
  }

}



export { Flags, Args, cliux }
