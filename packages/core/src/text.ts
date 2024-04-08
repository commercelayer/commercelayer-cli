import Inflector from './inflector'


const capitalize = (str: string | undefined): string | undefined => {
	if (!str) return str
	return Inflector.capitalize(str)
}

const pluralize = (str: string, plural?: string | undefined): string => { return Inflector.pluralize(str, plural) }
const singularize = (str: string, singular?: string | undefined): string => { return Inflector.singularize(str, singular) }
const camelize = (str: string, lowFirstLetter?: boolean | undefined): string => { return Inflector.camelize(str, lowFirstLetter) }


export { capitalize, pluralize, singularize, camelize }
export { symbols } from './symbol'
