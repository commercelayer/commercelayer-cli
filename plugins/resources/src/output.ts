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


const formatCsv = (output: any, flags?: any) => {
	if (!output || (output.length === 0)) return ''
	const fields = Object.keys(output[0]).filter(f => {
		if (['id', 'type'].includes(f)) return (flags && flags.fields.includes(f))
		return true
	})
	let csv = ''
	fields.forEach(f => {
		csv += f.toUpperCase().replace(/_/g, ' ') + ';'
	})
	csv += '\n'
	output.forEach((o: { [x: string]: any }) => {
		csv += fields.map(f => o[f]).join(';') + '\n'
	})
	return csv
}


const formatOutput = (output: any, flags?: any, { color = true } = {}) => {
	if (!output) return ''
	if (typeof output === 'string') return output
	if (flags?.csv) return formatCsv(output, flags)
	return (flags && flags.json) ?
		JSON.stringify(output, null, (flags.unformatted ? undefined : 4)) : inspectObject(output, color)
}



export { inspectObject, formatOutput, formatCsv }
