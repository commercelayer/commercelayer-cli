import { inspect } from 'util'

const inspectObject = (object: any, color = true): string => {
	return inspect(object, {
		showHidden: false,
		depth: null,
		colors: color,
		sorted: false,
		maxArrayLength: Infinity,
		breakLength: 120,
	})
}


const formatOutput = (output: any, flags?: any, { color = true } = {}) => {
	if (!output) return ''
	if (typeof output === 'string') return output
	return inspectObject(output, color)
}


const sleep = async (ms: number) => {
	return new Promise(resolve => setTimeout(resolve, ms))
}


const localeDate = (date: string): string => {
	if (!date) return ''
	return new Date(Date.parse(date)).toLocaleString()
}



export { inspectObject, formatOutput, sleep, localeDate }
