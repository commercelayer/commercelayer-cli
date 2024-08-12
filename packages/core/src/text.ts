import Inflector from './inflector'


const capitalize = (str?: string): string | undefined => {
	if (!str) return str
	return Inflector.capitalize(str)
}

const dasherize = (str?: string): string | undefined => {
	if (!str) return str
    str = str.toLocaleLowerCase()
		return str.replace(/ _/g, '-')
}

const underscorize = (str?: string): string | undefined => {
	if (!str) return str
    str = str.toLocaleLowerCase()
		return str.replace(/ -/g, '_')
}

const pluralize = (str: string, plural?: string): string => { return Inflector.pluralize(str, plural) }
const singularize = (str: string, singular?: string): string => { return Inflector.singularize(str, singular) }
const camelize = (str: string, lowFirstLetter?: boolean): string => { return Inflector.camelize(str, lowFirstLetter) }



export { capitalize, pluralize, singularize, camelize, dasherize, underscorize }
export { symbols } from './symbol'
