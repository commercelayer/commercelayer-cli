/* eslint-disable no-console */
import { Resource } from '../commands/resources'
import axios from 'axios'
import cl from '@commercelayer/js-sdk'

const resUrl = 'https://core.commercelayer.io/api/public/resources'
const resFile = './resources.json'


const getResourcesJson = async (): Promise<any> => {

	let resources

	try {
		console.log(`Loading resources from remote url ${resUrl} ...`)
		const response = await axios.get(resUrl)
		resources = response.data
	} catch (error) {
		console.log('Error loading resources from ' + resUrl)
		resources = undefined
	}

	if (!resources) try {
		console.log(`Loading resources from local file ${resFile} ...`)
		resources = require(resFile)
	} catch (error) {
		console.log('Error loading resources from ' + resFile)
		resources = undefined
	}

	return resources

}


const isSingleton = (res: string): boolean => {
	return ['organization'].includes(res)
}


const parseResourcesSchema = async (): Promise<Resource[]> => {

	const resJson = await getResourcesJson()

	if (resJson) {

		const Inflector = require('inflector-js')

		const resList = resJson.data.map((r: { id: string }) => {
			const singleton = isSingleton(r.id)
			const item = {
				name: r.id,
				api: singleton ? r.id : Inflector.pluralize(r.id),
				sdk: Inflector.camelize(r.id),
				singleton,
			}
			return item
		})

		return resList

	}

	return []

}


const parseResourcesSdk = async (): Promise<Resource[]> => {

	const Inflector = require('inflector-js')

	const resList = Object.keys(cl).filter(r => (r.charAt(0) === r.charAt(0).toUpperCase())).map(r => {
		const name = Inflector.underscore(r)
		const singleton = isSingleton(name)
		const item = {
			name: name,
			api: singleton ? name : Inflector.pluralize(name),
			sdk: r,
			singleton,
		}
		return item
	})


	return resList

}


const exportResources = async ({ source = 'sdk', variable = false, name = 'resources', array = false, tab = false } = {}): Promise<void> => {

	const resources = await ((source.toLowerCase() === 'sdk') ? parseResourcesSdk() : parseResourcesSchema())

	if (variable || array) console.log((variable ? `const ${name}: Resource[] = ` : '') + '[')
	resources.forEach(res => {
		let item = `${tab ? '\t' : ''}{ `
		item += `name: '${res.name}', api: '${res.api}', sdk: '${res.sdk}'`
		if (res.singleton) item += ', singleton: true'
		item += ' }'
		console.log(item)
	})
	if (array) console.log(']\n')

}


exportResources({ array: true, tab: true })
