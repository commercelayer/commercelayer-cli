/* eslint-disable no-console */
import { Resource } from '../commands/resources'
import axios from 'axios'
import { CommerceLayerStatic } from '@commercelayer/sdk'

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
	return ['organization', 'application'].includes(res)
}


const parseResourcesSchema = async (): Promise<Resource[]> => {

	const resJson = await getResourcesJson()

	if (resJson) {

		const Inflector = require('inflector-js')

		const resList = resJson.data.map((r: { id: string; attributes: { singleton: boolean } }) => {
			const item = {
				name: r.id,
				api: r.attributes.singleton ? r.id : Inflector.pluralize(r.id),
				model: Inflector.camelize(r.id),
				singleton: r.attributes.singleton,
			}
			return item
		})

		return resList

	}

	return []

}


const parseResourcesSdk = async (): Promise<Resource[]> => {

	const Inflector = require('inflector-js')

	const resList = CommerceLayerStatic.resources().map(r => {
		const singular = Inflector.singularize(r)
		const item = {
			name: singular,
			api: r,
			model: Inflector.camelize(singular),
			singleton: isSingleton(r),
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
		item += `name: '${res.name}', api: '${res.api}', model: '${res.model}'`
		if (res.singleton) item += ', singleton: true'
		item += ' },'
		console.log(item)
	})
	if (array) console.log(']\n')

	console.log('\nResources generated from: ' + source + '\n')

}


const source = (process.argv.length > 2) ? (['sdk', 'online'].includes(process.argv[2]) ? process.argv[2] : 'sdk') : undefined

exportResources({ source, array: true, tab: true })
