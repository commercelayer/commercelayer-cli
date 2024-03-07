import type { QueryParams } from '@commercelayer/provisioning-sdk'
import { getOperation } from '.'
import { clOutput } from '@commercelayer/cli-core'
import type { RequestData } from './request'


const buildTypescript = (request: RequestData, params?: QueryParams, flags?: any): string => {

	const hasParams = params && (Object.keys(params).length > 0)
	const operation = getOperation(request)
  const qpSuffix = (operation.name === 'list') ? 'List' : 'Retrieve'
	const paramsImport = hasParams ? `, { QueryParams${qpSuffix} }` : ''

	let ts = `import commercelayer${paramsImport} from '@commercelayer/provisioning-sdk'`

	ts += `\nconst accessToken = '${flags.accessToken}'`
	if (flags.domain) ts += `\nconst domain = '${flags.domain}'`

	ts += `\n\nconst cl = commercelayer({ accessToken${flags.domain ? ', domain' : ''} })`

	if (hasParams) ts += `\n\nconst params: QueryParams${qpSuffix} = ${clOutput.printObject(params, { color: false })}`

  const args: string[] = []
  if (operation.id) args.push(`'${operation.id}'`)
  if (hasParams) args.push('params')

	ts += `\n\ncl.${operation.resource}.${operation.name}(${args.join(', ')}).then(console.log)`

	return ts

}


export { buildTypescript }
