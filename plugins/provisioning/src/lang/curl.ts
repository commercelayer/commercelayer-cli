import type { QueryParams } from '@commercelayer/provisioning-sdk'
import { getFullUrl } from '.'
import { type RequestData, getMethod, getHeaders } from './request'


const headers = (request: RequestData): string => {
	return Object.entries(getHeaders(request)).map(([h, v]) => {
		return `-H '${h}: ${v}'`
	}).join(' \\\n  ')
}


const buildCurl = (request: RequestData, _params?: QueryParams): string => {
	let cmd = `curl -g -X ${getMethod(request)} \\\n  '${getFullUrl(request)}' \\\n  ${headers(request)}`
	if (request.data) cmd += ` \\\n-d '${JSON.stringify(request.data)}'`
	return cmd
}


export { buildCurl }
