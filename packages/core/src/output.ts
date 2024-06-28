/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { inspect } from 'node:util'
import type { KeyValObj } from './command'


/** Print a formatted object */
const printObject = (obj: any, options?: { color?: boolean, sort?: boolean, width?: number }): string => {
	return inspect(obj, {
		showHidden: false,
		depth: null,
		colors: (options?.color === undefined) ? true : options.color,
		sorted: (options?.sort === undefined) ? false : options?.sort,
		maxArrayLength: Infinity,
		breakLength: options?.width || 120
	})
}


/** Print object in JSON format */
const printJSON = (obj: any, options?: { unformatted?: boolean; tabSize?: number }): string => {
	return JSON.stringify(obj, null, ((options?.unformatted || false) ? undefined : (options?.tabSize || 4)))
}


/** Print object in CSV format */
const printCSV = (obj: object[], flags?: any): string => {
	if (!obj || (obj.length === 0)) return ''
	const fields = Object.keys(obj[0]).filter(f => {
		if (['id', 'type'].includes(f)) return flags?.fields.includes(f)
		return true
	})
	let csv = fields.map(f => f.toUpperCase().replace(/_/g, ' ')).join(';') + '\n'
	obj.forEach((o: KeyValObj) => {
		csv += fields.map(f => o[f]).join(';') + '\n'
	})
	return csv
}


/** Center a string in the given width space */
const center = (str: string, width: number): string => {
	return str.padStart(str.length + Math.floor((width - str.length) / 2), ' ').padEnd(width, ' ')
}


/** Compute longest string in a list of strings */
const maxLength = (values: any[], field: string): number => {
	return values.reduce((ml, v) => {
		const f = Array.isArray(v[field]) ? v[field].join() : v[field]
		return Math.max(ml, String(f).length)
	}, 0)
}


/** Clean ISO string date */
const cleanDate = (date: string): string => {
	return date.replace('T', ' ').replace('Z', '').substring(0, date.lastIndexOf('.'))
}

/** Localized string date */
const localeDate = (date: string): string => {
	if (!date) return ''
	return new Date(Date.parse(date)).toLocaleString()
}


/** Format aoutput */
const formatOutput = (output: any, flags?: any, { color = true } = {}): string => {
	if (!output) return ''
	if (typeof output === 'string') return output
	if (flags) {
		if (flags.csv) return printCSV(output, flags)
		if (flags.json) return printJSON(output, { unformatted: flags.unformatted })
	}
	return printObject(output, { color })
}


/** Format error message */
const formatError = (error: any, flags?: any): string => {
	return formatOutput(error.errors || error, flags)
}


export { printObject, printJSON, printCSV, center, maxLength, cleanDate, localeDate, formatOutput, formatError }
