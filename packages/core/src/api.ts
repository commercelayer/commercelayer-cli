import config from './config'

type ApiMode = 'test' | 'live'
export type { ApiMode }


/** Build base URL */
const baseURL = (slug: string, domain: string | undefined): string => {
	return `https://${slug.toLowerCase()}.${domain ? domain : config.api.default_domain}`
}


/** Extract domain name from URL */
const extractDomain = (baseUrl: string): string | undefined => {
	if (!baseUrl) return undefined
	return baseUrl.substring(baseUrl.indexOf('.') + 1)
}


/** Decode API execution mode */
const execMode = (liveFlag: string | boolean | undefined): ApiMode => {
	return ((liveFlag === true) || (liveFlag === 'live')) ? 'live' : 'test'
}


export { baseURL, extractDomain, execMode }
