import { inspect } from 'util'
import fs from 'fs'
import { formatCsv } from './csv'



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
	if (flags?.csv) return formatCsv(output, flags)
	return (flags && flags.json) ?
		JSON.stringify(output, null, (flags.unformatted ? undefined : 4)) : inspectObject(output, color)
}


const exportOutput = async (output: any, flags: any, filePath: string) => {
	const out = formatOutput(output, flags, { color: false })
	fs.writeFileSync(filePath, out)
	return Promise.resolve(true)
}



export { inspectObject, formatOutput, exportOutput }
