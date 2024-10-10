import type { QueryParams } from '@commercelayer/sdk'
import { type RequestData, getMethod, getHeaders, getFullUrl } from './request'


const headers = (request: RequestData): string => {
	return Object.entries(getHeaders(request)).map(([h, v]) => {
		return `-H '${h}: ${v}'`
	}).join(' \\\n  ')
}


const buildCurl = (request: RequestData, _params?: QueryParams): string => {
	let cmd = `curl -g -X ${getMethod(request)} \\\n  '${getFullUrl(request)}' \\\n  ${headers(request)}`
	if (request.data) {
    const d = (typeof request.data === 'string')? request.data : JSON.stringify(request.data)
    cmd += ` \\\n-d '${d}'`
  }
	return cmd
}


export { buildCurl }
