import { clColor } from '@commercelayer/cli-core'


const printScope = (scope: string | string[] | undefined): string => {
	if (scope) {
		if (Array.isArray(scope)) {
			if (scope.length === 0) return ''
			return scope[0] + ((scope.length > 1) ? ` ${clColor.italic.dim('+' + (scope.length - 1))}` : '')
		}
		return scope
	}
	return ''
}



export { printScope }
