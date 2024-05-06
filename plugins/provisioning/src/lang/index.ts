import type { QueryParams } from '@commercelayer/provisioning-sdk'
import { buildCurl } from './curl'
import type { RequestData } from './request'
import { buildRuby } from './ruby'
import { buildTypescript } from './node'
import inquirer from 'inquirer'

export { isRequestInterrupted } from './request'


export * from './request'


export const availableLanguages = ['curl', 'node']

export const languageInfo = {
	curl: { name: 'cURL', label: 'cURL command' },
	node: { name: 'Node', label: 'Node SDK source code' },
}


const buildCommand = (lang: string, request: RequestData, params?: QueryParams, flags?: any): string => {
	if (lang) switch (lang.toLowerCase()) {
		case 'curl': return buildCurl(request, params)
		case 'node': return buildTypescript(request, params, flags)
		case 'ruby': return buildRuby(request, params)
		default: return ''
	}
	else return ''
}


const getLanguageArg = (flags: any): string => {
	let lang = flags.lang
	for (const l of availableLanguages) {
		if (flags[l]) {
			lang = l
			break
		}
	}
	return lang
}


const promptLanguage = async (): Promise<string> => {
	return await inquirer.prompt([{
		type: 'list',
		name: 'language',
		message: 'Select a format to show the command live documentation:',
		choices: availableLanguages.map(l => {
			const info = languageInfo[l as keyof typeof languageInfo]
			return { name: info.label, value: l, short: info.name }
		}),
	}]).then(answers => answers.language)
}


export { getLanguageArg, buildCommand, promptLanguage }
