import { QueryParams } from '@commercelayer/sdk'
import { getOperation, getResource } from '.'
import { RequestData } from './request'


const buildTypescript = (request: RequestData, _params?: QueryParams): string => {

	let ts = 'import commercelayer from \'@commercelayer/sdk\''

	ts += '\n\nconst cl = commercelayer({ organization: \'<your-organization-slug>\', accessToken: \'<your-access-token>\' })'

	ts += `\n\nconst res = cl.${getResource(request)}.${getOperation(request)}().then(console.log)`

	return ts

}


export { buildTypescript }
