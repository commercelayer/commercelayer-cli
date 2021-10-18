import ApiError from '@commercelayer/sdk/lib/error'
import { inspect } from 'util'


const inspectObject = (object: any, options?: any): string => {
	return inspect(object, {
		showHidden: false,
		depth: null,
		colors: options?.color || true,
		sorted: false,
		maxArrayLength: Infinity,
		breakLength: options?.breakLength || 120,
	})
}


const formatOutput = (output: any, flags?: any, { color = true } = {}) => {
	if (!output) return ''
	if (typeof output === 'string') return output
	return inspectObject(output, color)
}

const formatError = (error: ApiError, flags: any): string => {
	return formatOutput(error.errors, flags)
}


const sleep = async (ms: number) => {
	return new Promise(resolve => setTimeout(resolve, ms))
}


const center = (str: string, width: number): string => {
	return str.padStart(str.length + Math.floor((width - str.length) / 2), ' ').padEnd(width, ' ')
}


const localeDate = (date: string): string => {
	if (!date) return ''
	return new Date(Date.parse(date)).toLocaleString()
}



export { inspectObject, formatOutput, sleep, localeDate, center, formatError }
