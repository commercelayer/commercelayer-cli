
import _ from 'lodash'
import { inspect } from 'util'
import { AppKey } from './config'


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

const appKeyValid = (appKey: AppKey): boolean => {
	return (appKey.key !== '') && (appKey.id !== '')
}

const appKeyMatch = (app1: AppKey, app2: AppKey): boolean => {
	return app1 && app2 && (app1.key === app2.key) && (app1.mode === app2.mode) && (app1.id === app2.id)
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


const center = (str: string, width: number): string => {
	return str.padStart(str.length + Math.floor((width - str.length) / 2), ' ').padEnd(width, ' ')
}


const maxLength = (values: any[], field: string): number => {
	return values.reduce((ml, v) => {
		return Math.max(ml, v[field].length)
	}, 0)
}



export { baseURL, execMode, appKey, appKeyValid, appKeyMatch, sleep, extractDomain, print, center, maxLength }
