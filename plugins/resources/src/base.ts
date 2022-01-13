import Command, { flags } from '@oclif/command'
import { findResource, Resource } from './util/resources'
import { filterAvailable } from './commands/resources/filters'
import { formatOutput, exportOutput } from './output'
import { exportCsv } from './csv'
import chalk from 'chalk'
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import { fixType, KeyValRel, KeyValArray, KeyValObj, KeyValString, KeyValSort, KeyVal } from './common'
import { CommerceLayerStatic, QueryParams, QueryParamsRetrieve } from '@commercelayer/sdk'
import { availableLanguages, buildCommand, getLanguageArg, languageInfo, promptLanguage, RequestData } from './lang'
import { clToken, clUpdate } from '@commercelayer/cli-core'
import { aliasExists, checkAlias, CommandParams, loadCommandData, ResourceOperation, saveCommandData } from './commands'
import { ResourceId, ResourceType } from '@commercelayer/sdk/lib/cjs/resource'
import { IConfig } from '@oclif/config'



const pkg = require('../package.json')


export const FLAG_SAVE_COMMAND = 'save-args'
export const FLAG_LOAD_PARAMS = 'load-args'


export default abstract class extends Command {

  static flags = {
    organization: flags.string({
      char: 'o',
      description: 'the slug of your organization',
      required: true,
      env: 'CL_CLI_ORGANIZATION',
    }),
    domain: flags.string({
      char: 'd',
      required: false,
      hidden: true,
      dependsOn: ['organization'],
      env: 'CL_CLI_DOMAIN',
    }),
    accessToken: flags.string({
      hidden: true,
      required: true,
      env: 'CL_CLI_ACCESS_TOKEN',
    }),
    include: flags.string({
      char: 'i',
      multiple: true,
      description: 'comma separated resources to include',
    }),
    fields: flags.string({
      char: 'f',
      multiple: true,
      description: 'comma separeted list of fields in the format [resource]=field1,field2...',
    }),
    json: flags.boolean({
      char: 'j',
      description: 'convert output in standard JSON format',
      // hidden: true,
    }),
    unformatted: flags.boolean({
      char: 'u',
      description: 'print unformatted JSON output',
      dependsOn: ['json'],
      // hidden: true,
    }),
    raw: flags.boolean({
      char: 'R',
      description: 'print out the raw API response',
      hidden: false,
    }),
    doc: flags.boolean({
      char: 'D',
      description: 'shows the CLI command in a specific language',
    }),
    lang: flags.string({
      char: 'l',
      description: 'show the CLI command in the specified language syntax',
      exclusive: availableLanguages,
      options: availableLanguages,
      dependsOn: ['doc'],
    }),
    curl: flags.boolean({
      description: `show the equivalent ${languageInfo.curl.label} of the CLI command`,
      exclusive: ['lang', ...availableLanguages.filter(l => l !== 'curl')],
      parse: () => 'curl',
      hidden: !availableLanguages.includes('curl'),
      dependsOn: ['doc'],
    }),
    node: flags.boolean({
      description: `show the equivalent ${languageInfo.node.label} of the CLI command`,
      exclusive: ['lang', ...availableLanguages.filter(l => l !== 'node')],
      parse: () => 'node',
      hidden: !availableLanguages.includes('node'),
      dependsOn: ['doc'],
    }),
    'save-args': flags.string({
      description: 'save command data to file for future use',
      // exclusive: [FLAG_LOAD_PARAMS],
    }),
    'load-args': flags.string({
      description: 'load previously saved command arguments',
      // exclusive: [FLAG_SAVE_COMMAND],
    }),
  }


  static args = [
    { name: 'resource', description: 'the resource type', required: true },
  ]


  // INIT (override)
  async init() {
    clUpdate.checkUpdate(pkg)
    return super.init()
  }


  // CATCH (override)
  async catch(error: any) {
    if (error.message && error.message.match(/Missing 1 required arg:\nresource/))
      this.error(`Missing argument ${chalk.redBright('resource')}`,
        { suggestions: [`Execute command ${chalk.italic('resources')} to get a list of all available CLI resources`] }
      )
    // else throw error				// overwrite command catch method
    else return super.catch(error)	// extend command catch method
  }



  // -- CUSTOM METHODS -- //


  checkResource(res: string, { required = true, singular = false } = {}): Resource {
    if (!res && required) this.error('Resource type not defined')
    const resource = findResource(res, { singular })
    if (resource === undefined) this.error(`Invalid resource ${chalk.redBright(res)}`,
      { suggestions: [`Execute command ${chalk.italic('resources')} to get a list of all available CLI resources`] }
    )
    return resource
  }


  checkResourceId(resource: string, resourceId: string, required = true): any {

    let res = resource
    let id = resourceId

    const si = res.indexOf('/')
    if (si >= 0) {
      const rt = res.split('/')
      if (id && rt[1]) this.error(`Double definition of resource id: [${res}, ${id}]`,
        { suggestions: [`Define resource id as command argument (${chalk.italic(id)}) or as part of the resource itself (${chalk.italic(res)}) but not both`] }
      )
      else id = rt[1]
      res = rt[0]
    }

    const res_ = findResource(res, { singular: true })
    const singleton = res_ && res_.singleton

    if (id) {
      if (singleton) this.error(`Singleton resource ${chalk.italic(res)} does not require id`)
    } else if (required && !singleton) this.error('Resource id not defined')

    return {
      res,
      id,
      singleton,
    }

  }


  includeFlag(flag: string[], relationships?: KeyValRel): string[] {

    const values: string[] = []

    if (flag) {
      const flagValues = flag.map(f => f.split(',').map(t => t.trim()))
      flagValues.forEach(a => values.push(...a))
      if (values.some(f => f.split('.').length > 3)) this.error('Can be only included resources within the 3rd level of depth')
    }

    if (relationships) {
      Object.keys(relationships).forEach(r => {
        if (!values.includes(r)) values.push(r)
      })
    }

    return values

  }


  objectFlag(flag: string[]): KeyValObj {

    const objects: KeyValObj = {}

    if (flag && (flag.length > 0)) {
      flag.forEach(f => {

        const slashSep = f.indexOf('/')
        if (slashSep < 0) this.error(`No name or fields defined in flag object${chalk.italic(f)}`)

        const name = f.substring(0, slashSep)
        if (name === '') this.error(`No name defined in flag object ${f}`)
        const fields = f.substring(slashSep + 1).split(/(?<!\\),/g).map(v => v.trim())  // escape ',' in value with \\ (double back slash)
        if (fields[0].trim() === '') this.error(`No fields defined for object field ${chalk.italic(name)}`)

        const obj: KeyValObj = {}

        fields.forEach(f => {

          const eqi = f.indexOf('=')
          if (eqi < 0) this.error(`No value defined for object field ${chalk.italic(f)} of object ${chalk.italic(name)}`)

          const n = f.substring(0, eqi)
          const v = f.substring(eqi + 1).replace(/\\,/g, ',')

          obj[n] = fixType(v)

        })

        if (objects[name] === undefined) objects[name] = {}
        objects[name] = { ...objects[name], ...obj }

      })
    }

    return objects

  }


  fieldsFlag(flag: string[], type: string): KeyValArray {

    const fields: KeyValArray = {}

    if (flag && (flag.length > 0)) {
      flag.forEach(f => {

        let res = type
        let val = f

        if (f.indexOf('/') > -1) {

          const kv = f.split('/')

          if (kv.length > 2) this.error('Can be defined only one resource for each fields flag',
            { suggestions: [`Split the value ${chalk.italic(f)} into two fields flags`] }
          )

          res = kv[0].replace('[', '').replace(']', '')
          this.checkResource(res)

          val = kv[1]

        }

        const values = val.split(',').map(v => v.trim())
        if (values[0].trim() === '') this.error(`No fields defined for resource ${chalk.italic(res)}`)

        if (fields[res] === undefined) fields[res] = []
        fields[res].push(...values)

      })
    }

    return fields

  }


  whereFlag(flag: string[]): KeyValString {

    const wheres: KeyValString = {}

    if (flag && (flag.length > 0)) {
      flag.forEach(f => {

        const wt = f.split('=')
        if (wt.length < 2) this.error(`Filter flag must be in the form ${chalk.italic('predicate=value')}`)
        const w = wt[0]
        if (!filterAvailable(w)) this.error(`Invalid query filter: ${chalk.redBright(w)}`, {
          suggestions: [`Execute command ${chalk.italic('resources:filters')} to get a full list of all available filter predicates`],
          ref: 'https://docs.commercelayer.io/api/filtering-data#list-of-predicates',
        })

        const v = wt[1]

        wheres[w] = v

      })
    }

    return wheres

  }


  sortFlag(flag: string[]): KeyValSort {

    const sort: KeyValSort = {}

    if (flag && (flag.length > 0)) {

      if (flag.some(f => {
        const ft = f.split(',')
        return (ft.includes('asc') || ft.includes('desc'))
      })) {
        flag.forEach(f => {

          const ot = f.split(',')
          if (ot.length > 2) this.error('Can be defined only one field for each sort flag',
            { suggestions: [`Split the value ${chalk.italic(f)} into two or more sort flags`] }
          )

          const of = ot[0]
          if (of.startsWith('-')) this.error('You cannot mix two ordering syntaxes',
            { suggestions: [`Choose between the style ${chalk.italic('<field>,<order>')} and the style ${chalk.italic('[-]<field>')}`] }
          )
          const sd = ot[1] || 'asc'
          if (!['asc', 'desc'].includes(sd)) this.error(`Invalid sort flag: ${chalk.redBright(f)}`,
            { suggestions: [`Sort direction can assume only the values ${chalk.italic('asc')} or ${chalk.italic('desc')}`] }
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


  _keyvalFlag(flag: string[], type = 'attribute'): KeyValString {

    const param: KeyValString = {}

    if (flag && (flag.length > 0)) {
      flag.forEach(f => {

        const eqi = f.indexOf('=')
        if (eqi < 1) this.error(`Invalid ${type.toLowerCase()} ${chalk.redBright(f)}`, {
          suggestions: [`${_.capitalize(type)} flags must be defined using the format ${chalk.italic('name=value')}`],
        })

        const name = f.substr(0, eqi)
        const value = f.substr(eqi + 1)

        if (param[name]) this.warn(`${_.capitalize(type)} ${chalk.yellow(name)} has already been defined`)

        param[name] = value

      })
    }

    return param

  }


  attributeFlag(flag: string[]): KeyValObj {
    const attr = this._keyvalFlag(flag, 'attribute')
    const attributes: KeyValObj = {}
    Object.entries(attr).forEach(([k, v]) => {
      attributes[k] = (v === 'null') ? null : v
    })
    return attributes
  }


  metadataFlag(flag: string[], { fixTypes = false } = {}): KeyVal {
    const md = this._keyvalFlag(flag, 'metadata')
    const metadata: KeyVal = {}
    Object.keys(md).forEach(k => {
      metadata[k] = fixTypes ? fixType(md[k]) : md[k]
    })
    return metadata
  }


  relationshipFlag(flag: string[]): KeyValRel {

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
        } else this.error(`Invalid relationship flag: ${chalk.redBright(f)}`,
          { suggestions: [`Define the relationship using the format ${chalk.italic('attribute_name=resource_type/resource_id')}`] }
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

        if (relationships[name]) this.warn(`Relationship ${chalk.yellow(name)} has already been defined`)

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
          { suggestions: [`Split the value ${chalk.italic(f)} into two extract flags`] }
        )
        else
          if (kv.length === 1) this.error(`No fields defined for object ${chalk.italic(kv[0])}`)

        const name = kv[0]
        if (name === '') this.error(`No name defined in flag extract ${f}`)
        if (kv[1].trim() === '') this.error(`No fields defined for object ${chalk.italic(kv[0])}`)

        const fields = kv[1].split(/(?<!\\),/g).map(v => v.trim())  // escape ',' in value with \\ (double back slash)
        if (fields[0].trim() === '') this.error(`No fields defined for object field ${chalk.italic(name)}`)

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
        for (const k of Object.keys(curObj)) if (!extFields.includes(k)) delete curObj[k]

    })

  }


  protected checkOperation(sdk: any, name: string): boolean {
    if (!sdk[name]) this.error(`Operation not supported for resource ${chalk.italic(sdk.type())}: ${chalk.redBright(name)}`)
    return true
  }


  printOutput(output: any, flags: any | undefined) {
    if (output) this.log(formatOutput(output, flags))
  }


  printError(error: any, flags?: any): void {

    let err = error

    if (CommerceLayerStatic.isApiError(err)) {
      err = err.errors
    } else
      if (error.response) {
        if (error.response.status === 401) this.error(chalk.bgRed(`${error.response.statusText} [${error.response.status}]`),
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


  saveOutput(output: any, flags: any) {

    try {

      let filePath = flags.save || flags['save-path']
      if (!filePath) this.warn('Undefined output save path')

      // Special directory (home / desktop)
      const root = filePath.toLowerCase().split('/')[0]
      if (['desktop', 'home'].includes(root)) {
        let filePrefix = this.config.home
        if (root === 'desktop') filePrefix += '/Desktop'
        filePath = filePath.replace(root, filePrefix)
      }
      const fileDir = path.dirname(filePath)
      if (flags['save-path'] && !fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true })


      const fileExport = flags.csv ? exportCsv : exportOutput
      fileExport(output, flags, filePath)
        .then(() => {
          if (fs.existsSync(filePath)) this.log(`Command output saved to file ${chalk.italic(filePath)}\n`)
        })
        .catch(() => this.error(`Unable to save command output to file ${filePath}`,
          { suggestions: ['Please check you have the right file system permissions'] }
        ))

    } catch (error: any) {
      if (error.code === 'ENOENT') this.warn(`Path not found ${chalk.redBright(error.path)}: execute command with flag ${chalk.italic.bold('-X')} to force path creation`)
      else throw error
    } finally {
      this.log()
    }

  }


  protected async showLiveDocumentation(request: RequestData, params?: QueryParams, flags?: any): Promise<string> {
    const lang = getLanguageArg(flags) || await promptLanguage()
    const cmd = buildCommand(lang, request, params, flags)
    this.printCommand(lang, cmd)
    return cmd
  }


  protected printCommand(lang: string, command: string) {

    const header = languageInfo[lang as keyof typeof languageInfo].label
    // const footer = header.replace(/./g, '-')

    this.log()
    this.log(`${chalk.underline.cyan(header)}`)
    // this.log(chalk.cyan(`------------------------------{ ${header} }------------------------------`))
    this.log()
    this.log(command)
    // this.log()
    // this.log(chalk.cyan(`---------------------------------${footer}---------------------------------`))
    this.log()

  }


  protected checkApplication(accessToken: string, kinds: string[]): boolean {

    const info = clToken.decodeAccessToken(accessToken)

    if (info === null) this.error('Invalid access token provided')
    else
      if (!kinds.includes(info.application.kind))
        this.error(`Invalid application kind: ${chalk.redBright(info.application.kind)}. Application kind must be one of the following: ${chalk.cyanBright(kinds.join(', '))}`)

    return true

  }


  protected checkAlias(alias: string, resource: string, operation: ResourceOperation, config: IConfig) {
    let ok = false
    try {
      ok = checkAlias(alias)
    } catch (error) {
      this.printError(error)
    }
    if (ok && aliasExists(alias, config, resource, operation))
      this.error(`Alias already used for resource type ${chalk.yellowBright(resource)} and operation ${chalk.yellowBright(operation)}: ${chalk.redBright(alias)}`)
  }


  protected saveParams = (alias: string, resource: ResourceType | ResourceId, operation: ResourceOperation, params: QueryParams) => {

    const toBeRemoved = ['--save-args', '--load-args', '--accessToken', '-o', '--organization', '-d', '--domain']

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


  protected loadParams(alias: string, resource: string, operation: ResourceOperation): QueryParams {

    const cmdData = loadCommandData(alias, this.config, resource, operation)
    if (!cmdData) this.error(`No command arguments saved with alias ${chalk.redBright(alias)} for resource type ${chalk.yellowBright(resource)} and operation ${chalk.yellowBright(operation)}`)

    const queryParams: QueryParams = (operation && (operation === 'list')) ? cmdData.params : {
      include: cmdData.params.include,
      fields: cmdData.params.fields,
    } as QueryParamsRetrieve

    return queryParams

  }

}


export { flags }
