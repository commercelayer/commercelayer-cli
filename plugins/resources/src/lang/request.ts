import { CommerceLayerClient, RequestObj } from '@commercelayer/sdk'


type RequestData = {
	baseUrl: string;
	path: string;
	method: string;
	headers: any;
	params?: any;
	data?: any;
}

type RequestReader = {
	id: number;
	request: RequestData;
}


class RequestInterrupted extends Error {

	readonly requestInterrupted = true

	constructor() {
		super('REQUEST_INTERRUPT')
	}

}


const addRequestReader = (cl: CommerceLayerClient, interrupt = true): RequestReader => {

	const reader: RequestReader = {
		id: -1,
		request: { baseUrl: '', path: '/', method: 'get', headers: {} },
	}

	function requestInterceptor(request: RequestObj): RequestObj {

		const c = request
		const x = reader.request

		x.path = c.url || ''
		x.method = c.method || 'get'
		x.headers = c.headers
		x.params = c.params
		x.baseUrl = c.baseURL || ''
		x.data = c.data

		if (interrupt) throw new RequestInterrupted()

		return request

	}


	const interceptor = cl.addRequestInterceptor(requestInterceptor)
	reader.id = interceptor

	return reader

}


const isRequestInterrupted = (error: unknown): boolean => {
	return (error instanceof RequestInterrupted) && error.requestInterrupted
}


export { addRequestReader, RequestReader, RequestData, isRequestInterrupted }


export const getMethod = (request: RequestData): string => {
	return request.method?.toUpperCase()
}


export const getFullUrl = (request: RequestData): string => {
	let fullUrl = `${request.baseUrl}/${request.path}`
	if (request.params && (Object.keys(request.params).length > 0)) {
		const qs = Object.entries(request.params).map(([k, v]) => `${k}=${v}`).join('&')
		fullUrl += `?${qs}`
	}
	return fullUrl
}


export const getResource = (request: RequestData): string => {
	const slashIdx = request.path.indexOf('/')
	if (slashIdx < 0) return request.path
	return request.path.substring(0, slashIdx)
}


export const getHeaders = (request: RequestData): { [h: string]: string } => {
	/*
	const headers = { ...request.headers }
	for (const h of Object.keys(headers))
		if (['User-Agent', 'Content-Length'].includes(h)) delete headers[h]
	return headers
	*/
	return {
		Accept: request.headers.Accept,
		'Content-Type': request.headers['Content-Type'],
		Authorization: request.headers.Authorization,
	}
}


export const getOperation = (request: RequestData): string => {

	const res = getResource(request)
	const id = !request.path.endsWith(res)
	const method = request.method.toLowerCase()
	const singleton = ['application', 'organization'].includes(res)

	switch (method) {
		case 'get': return (singleton || id) ? 'retrieve' : 'list'
		case 'patch': return 'update'
		case 'post': return 'create'
		case 'delete': return 'delete'
		default: return 'retrieve'
	}

}
