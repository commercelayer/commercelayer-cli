
import { inspect } from 'util'
import { AppKey } from './config'
import chalk from 'chalk'


type ApiMode = 'test' | 'live'
export type { ApiMode }


const baseURL = (slug: string, domain: string | undefined): string => {
	return `https://${slug.toLowerCase()}.${domain ? domain : 'commercelayer.io'}`
}

const extractDomain = (baseUrl: string): string | undefined => {
	if (!baseUrl) return undefined
	return baseUrl.substring(baseUrl.indexOf('.') + 1)
}


const execMode = (liveFlag: string | boolean | undefined): ApiMode => {
	return (liveFlag || (liveFlag === 'live')) ? 'live' : 'test'
}


const appKey = (): string => {
	return Date.now().toString(36)
}

const appKeyValid = (appKey: AppKey): boolean => {
	return (appKey.key !== undefined) && (appKey.key !== '')
}

const appKeyMatch = (app1?: AppKey, app2?: AppKey): boolean => {
	const a1 = app1 !== undefined
	const a2 = app2 !== undefined
	return (!a1 && !a2) || (a1 && a2 && (app1.key === app2.key))
}


const sleep = async (ms: number) => {
	return new Promise(resolve => setTimeout(resolve, ms))
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
		const f = Array.isArray(v[field]) ? v[field].join() : v[field]
		return Math.max(ml, f.length)
	}, 0)
}


export { baseURL, execMode, appKey, appKeyValid, appKeyMatch, sleep, extractDomain, print, center, maxLength }



const printScope = (scope: string | string[] | undefined): string => {
	if (scope) {
		if (Array.isArray(scope)) {
			if (scope.length === 0) return ''
			return scope[0] + ((scope.length > 1) ? ` ${chalk.italic.dim('+' + (scope.length - 1))}` : '')
		}
		return scope
	}
	return ''
}

export { printScope }
