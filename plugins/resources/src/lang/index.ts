import { QueryParams } from '@commercelayer/sdk'
import { buildCurl } from './curl'
import { RequestData } from './request'
import { buildRuby } from './ruby'
import { buildTypescript } from './typescript'

export { isRequestInterrupted } from './request'


export * from './request'


export const availableLanguages = ['curl']

export const languageInfo = {
	curl: { name: 'cURL', label: 'cURL command' },
	typescript: { name: 'Typescript', label: 'TypeScript code' },
}


const buildCommand = (lang: string, request: RequestData, params?: QueryParams): string => {
	if (lang) switch (lang.toLowerCase()) {
		case 'curl': return buildCurl(request, params)
		case 'typescript': return buildTypescript(request, params)
		case 'ruby': return buildRuby(request, params)
		default: return ''
	}
	else return ''
}


const getLanguage = (flags: any): string => {
	let lang = flags.lang
	for (const l of availableLanguages) {
		if (flags[l]) {
			lang = l
			break
		}
	}
	return lang
}


export { getLanguage, buildCommand }
