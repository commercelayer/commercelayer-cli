/* eslint-disable @typescript-eslint/no-explicit-any */
import { inspect } from 'util'

/** Print a formatted object */
const printObject = (object: any, options?: { color?: boolean, sort?: boolean, width?: number }): string => {
	return inspect(object, {
		showHidden: false,
		depth: null,
		colors: options?.color || true,
		sorted: options?.sort || false,
		maxArrayLength: Infinity,
		breakLength: options?.width || 120,
	})
}


/** Print object in JSON format */
const jsonObject = (obj: any, { unformatted }: { unformatted?: boolean }) => {
	return JSON.stringify(obj, null, (unformatted ? undefined : 4))
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

const localeDate = (date: string): string => {
	if (!date) return ''
	return new Date(Date.parse(date)).toLocaleString()
}


/** Format aoutput */
const formatOutput = (output: any, flags?: any, { color = true } = {}): string => {
	if (!output) return ''
	if (typeof output === 'string') return output
	return printObject(output, { color })
}


/** Format error message */
const formatError = (error: any, flags: any): string => {
	return formatOutput(error.errors || error, flags)
}


export { printObject, jsonObject, center, maxLength, cleanDate, localeDate, formatOutput, formatError }
