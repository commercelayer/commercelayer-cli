
import _ from 'lodash'
import { inspect } from 'util'


type ApiMode = 'test' | 'live'
export type { ApiMode }


const baseURL = (slug: string, domain: string | undefined): string => {
	return `https://${slug.toLowerCase()}.${domain ? domain : 'commercelayer.io'}`
}

const execMode = (liveFlag: string | boolean | undefined): ApiMode => {
	return (liveFlag || (liveFlag === 'live')) ? 'live' : 'test'
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

const print = (object: any): string => {
	return inspect(object, {
		showHidden: false,
		depth: null,
		colors: true,
		sorted: false,
		maxArrayLength: Infinity,
		breakLength: 120,
	})
}

export { baseURL, execMode, appKey, sleep, extractDomain, print }
