
import _ from 'lodash'

const baseURL = (slug: string, domain: string | undefined): string => {
	return `https://${slug.toLowerCase()}.${domain ? domain : 'commercelayer.io'}`
}

const execMode = (liveFlag: string | boolean | undefined): string => {
	return liveFlag ? 'live' : 'test'
}

const appKey = (slug: string, domain: string | undefined): string => {
	return String(domain ? _.kebabCase(`${slug}.${domain}`) : slug).toLowerCase()
}

const sleep = async (ms: number) => {
	return new Promise(resolve => setTimeout(resolve, ms))
}

const extractDomain = (baseUrl: string): string | undefined => {
	if (!baseUrl) return undefined
	return baseUrl.substring(baseUrl.indexOf('.') + 1)
}

export { baseURL, execMode, appKey, sleep, extractDomain }
