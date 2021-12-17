import { QueryParams } from '@commercelayer/sdk'
import { getOperation, getResource } from '.'
import { output } from '@commercelayer/cli-core'
import { RequestData } from './request'


const buildTypescript = (request: RequestData, params?: QueryParams, flags?: any): string => {

	const hasParams = params && (Object.keys(params).length > 0)
	const operation = getOperation(request)
  const qpSuffix = (operation === 'list') ? 'List' : 'Retrieve'
	const paramsImport = hasParams ? `, { QueryParams${qpSuffix} }` : ''

	let ts = `import commercelayer${paramsImport} from '@commercelayer/sdk'`

	ts += `\n\nconst organization = '${flags.organization}'`
	ts += `\nconst accessToken = '${flags.accessToken}'`

	ts += '\n\nconst cl = commercelayer({ organization, accessToken })'

	if (hasParams) ts += `\n\nconst params: QueryParams${qpSuffix} = ${output.printObject(params, { color: false })}`

	ts += `\n\ncl.${getResource(request)}.${operation}(${hasParams ? 'params' : ''}).then(console.log)`

	return ts

}


export { buildTypescript }
