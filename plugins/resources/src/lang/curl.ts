import { QueryParams } from '@commercelayer/sdk'
import { getFullUrl } from '.'
import { RequestData, getMethod, getHeaders } from './request'



const buildCurl = (request: RequestData, _params?: QueryParams): string => {
	let cmd = `curl -g -X ${getMethod(request)} \\\n  "${getFullUrl(request)}" \\\n  ${headers(request)}`
	if (request.data) cmd += ` \\\n-d ${JSON.stringify(request.data)}`
	return cmd
}

const headers = (request: RequestData): string => {
	return Object.entries(getHeaders(request)).map(([h, v]) => {
		return `-H '${h}: ${v}'`
	}).join(' \\\n  ')
}


export { buildCurl }
