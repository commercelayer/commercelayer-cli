import Inflector from './inflector'


const capitalize = (str: string | undefined): string | undefined => {
	if (!str) return str
	let s = str.toLowerCase()
	s = s.substring(0, 1).toUpperCase() + s.substring(1)
	return s
}

const pluralize = Inflector.pluralize
const singularize = Inflector.singularize
const camelize = Inflector.camelize


export { capitalize, pluralize, singularize, camelize }
export { symbols } from './symbol'
