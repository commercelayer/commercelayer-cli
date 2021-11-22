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


const jsonObject = (obj: any, unformatted?: boolean) => {
  return JSON.stringify(obj, null, (unformatted ? undefined : 4))
}


const formatOutput = (output: any, flags?: any, { color = true } = {}) => {
	if (!output) return ''
	if (typeof output === 'string') return output
	if (flags?.csv) return formatCsv(output, flags)
	return (flags && flags.json) ?
		jsonObject(output, flags.unformatted) : inspectObject(output, color)
}


const exportOutput = async (output: any, flags: any, filePath: string): Promise<boolean> => {
	const out = formatOutput(output, flags, { color: false })
	fs.writeFileSync(filePath, out)
	return Promise.resolve(true)
}



export { inspectObject, jsonObject, formatOutput, exportOutput }
