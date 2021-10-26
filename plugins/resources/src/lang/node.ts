import { QueryParams } from '@commercelayer/sdk'
import { getOperation, getResource } from '.'
import { inspectObject } from '../output'
import { RequestData } from './request'


const buildTypescript = (request: RequestData, params?: QueryParams, flags?: any): string => {

	const hasParams = params && (Object.keys(params).length > 0)
	const operation = getOperation(request)
	const paramsImport = hasParams ? `, { QueryParams${(operation === 'list') ? 'List' : 'Retrieve'} }` : ''

	let ts = `import commercelayer${paramsImport} from '@commercelayer/sdk'`

	ts += `\n\nconst organization = '${flags.organization}'`
	ts += `\nconst accessToken = '${flags.accessToken}'`

	ts += '\n\nconst cl = commercelayer({ organization, accessToken })'

	if (hasParams) ts += '\n\nconst params: QueryParamsList = ' + inspectObject(params, false)

	ts += `\n\ncl.${getResource(request)}.${operation}(${hasParams ? 'params' : ''}).then(console.log)`

	return ts

}


export { buildTypescript }
