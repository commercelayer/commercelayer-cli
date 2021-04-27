/* eslint-disable no-console */
import { Resource } from '../commands/resources'

const parseResources = (): Resource[] => {

	const resJson = require('./resources.json')
	const Inflector = require('inflector-js')
	const util = require('util')

	const resList = resJson.data.map((r: { id: string }) => {
		return {
			name: r.id,
			api: Inflector.pluralize(r.id),
			sdk: Inflector.camelize(r.id),
		}
	})

	util.inspect(resList, false, null, true)

	return resList

}


const exportResources = ({ variable = false, name = 'resources', array = false, tab = false } = {}): void => {

	const resources = parseResources()

	if (variable || array) console.log((variable ? `const ${name}: Resource[] = ` : '') + '[')
	resources.forEach(res => {
		console.log(`${tab ? '\t' : ''}{ name: '${res.name}', api: '${res.api}', sdk: '${res.sdk}' },`)
	})
	if (array) console.log(']')

}


exportResources({ array: true, tab: true })
