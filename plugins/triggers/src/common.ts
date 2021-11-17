import { ApiError } from '@commercelayer/sdk'
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


export { formatOutput, formatError }


export type Trigger = {
	action: string;
  trigger: string;
  description: string;
  resource?: string;
}
