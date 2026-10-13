import { clApi, clOutput } from '@commercelayer/cli-core'
import type { QueryParams } from '@commercelayer/sdk'
import { getOperation, type RequestData } from './request'


const buildTypescript = (request: RequestData, params?: QueryParams, flags?: any): string => {

	const hasParams = params && (Object.keys(params).length > 0)
	const operation = getOperation(request)
  const qpSuffix = (operation.name === 'list') ? 'List' : 'Retrieve'
	const paramsImport = hasParams ? `, type QueryParams${qpSuffix}` : ''

	let ts = `import { CommerceLayer${paramsImport} } from '@commercelayer/sdk'`

	ts += `\n\nconst organization = '${flags.organization}'`
	ts += `\nconst accessToken = '${flags.accessToken}'`
	if (flags.domain) ts += `\nconst domain = '${flags.domain}'`

	const apiVersion = clApi.apiVersion(flags)
	ts += `\n\nconst cl = CommerceLayer({ organization, accessToken${apiVersion ? `, apiVersion: '${apiVersion}'` : ''}${flags.domain ? ', domain' : ''} })`

	if (hasParams) ts += `\n\nconst params: QueryParams${qpSuffix} = ${clOutput.printObject(params, { color: false })}`

  const args: string[] = []
  if (operation.id) args.push(`'${operation.id}'`)
  if (hasParams) args.push('params')

	ts += `\n\ncl.${operation.resource}.${operation.name}(${args.join(', ')}).then(console.log)`

	return ts

}


export { buildTypescript }
