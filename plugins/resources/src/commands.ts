import { QueryParams, QueryParamsList } from '@commercelayer/sdk'
import { IConfig } from '@oclif/config'
import { join } from 'path'
import fs from 'fs'
import { jsonObject } from './output'
import chalk from 'chalk'


const COMMANDS_DIR = 'commands'


type ResourceOperation = 'retrieve' | 'list' | 'create' | 'update' | 'delete'

type CommandParams = {
  alias: string;
  command: string;
  resource: string;
  id?: string;
  operation: ResourceOperation;
  argv: string[];
  params: QueryParams;
  saved_at: string;
}


export type { ResourceOperation, CommandParams }


const checkAlias = (alias: string): boolean => {

  const match = alias.match(/^[a-z0-9_-]*$/)
  if ((match === null) || (match.length > 1)) throw new Error(`Invalid alias: ${chalk.redBright(alias)}. Accepted characters are ${chalk.italic('[a-z0-9_-]')}`)

  const ml = 15
  const al = match[0]
  if (al.length > ml) throw new Error(`Alias must have a max length of ${chalk.yellowBright(String(ml))} characters`)

  return true

}


const commandFileName = (resource: string, alias: string, _operation?: string): string => {
  // return `${params.resource}.${params.operation}.${alias}.json`
  return `${resource}.${alias}.json`
}

const commandSaveDir = (config: IConfig) => {
  return join(config.configDir, COMMANDS_DIR)
}


const readCommandArgs = (config: IConfig, resource?: string): CommandParams[] => {
  const saveDir = commandSaveDir(config)
  const cmdParams = fs.readdirSync(saveDir)
    .filter(f => (!resource || f.startsWith(resource)) && f.endsWith('.json'))
    .map(f => {
      const json = fs.readFileSync(join(saveDir, f), { encoding: 'utf-8' })
      return JSON.parse(json)
    })
  return cmdParams
}


const saveCommandData = (alias: string, config: IConfig, params: CommandParams) => {

  checkAlias(alias)

  const fileName = commandFileName(params.resource, alias)

  const saveDir = commandSaveDir(config)
  if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true })

  fs.writeFileSync(join(saveDir, fileName), jsonObject(params))

}


const loadCommandData = (alias: string, resource: string, config: IConfig, operation?: ResourceOperation): CommandParams | undefined => {

  const saveDir = commandSaveDir(config)

  const cmdFiles = fs.readdirSync(saveDir)
    .filter(f => f.startsWith(`${resource}.`) && f.endsWith(`${operation ? operation : ''}.${alias}.json`))

  if (!cmdFiles || (cmdFiles.length === 0)) return undefined

  // There can be only one file with a specific alias for each resource type
  const cdmFile = fs.readFileSync(join(saveDir, cmdFiles[0]), { encoding: 'utf-8' })

  return JSON.parse(cdmFile)

}


const aliasExists = (resource: string, alias: string, config: IConfig, operation?: ResourceOperation): boolean => {
  const saveDir = commandSaveDir(config)
  const cmdData = fs.readdirSync(saveDir).find(f => !f.startsWith(`${resource}.${operation ? operation : ''}`) && f.endsWith(`${alias}.json`))
  return cmdData !== undefined
}


const deleteArgsFile = (resource: string, alias: string, config: IConfig): void => {
  const saveDir = commandSaveDir(config)
  const fileName = commandFileName(resource, alias)
  fs.unlinkSync(join(saveDir, fileName))
}

export { saveCommandData, loadCommandData, checkAlias, aliasExists, readCommandArgs, deleteArgsFile }



export const mergeCommandParams = (params: QueryParams, saved: QueryParams) => {

  const include = saved.include || []
  if (params.include) params.include.forEach(i => {
    if (!include.includes(i)) include.push(i)
  })

  const fields = saved.fields || {}
  if (params.fields) Object.entries(params.fields).forEach(([k, v]) => Object.assign(fields[k] || {}, v))

  const sl = saved as QueryParamsList
  const pl = params as QueryParamsList

  const sort = (sl.sort || {}) as { [key: string]: 'asc' | 'desc' }
  if (pl.sort) Object.entries(pl.sort).forEach(([k, v]) => Object.assign(sort[k] || {}, v))

  const filters = sl.filters || {}
  if (pl.filters) Object.entries(pl.filters).forEach(([k, v]) => Object.assign(filters[k] || {}, v))

  const pageSize = pl.pageSize || sl.pageSize

  const pageNumber = pl.pageNumber || sl.pageNumber

  Object.assign(params, {
    include,
    fields,
    filters,
    sort,
    pageNumber,
    pageSize,
  })

  // Remove empty params
  Object.entries(params).forEach(([p, v]) => {
    if (v && (typeof v === 'object') && (Object.keys(v).length === 0)) params[p as keyof QueryParams] = undefined
  })

}

