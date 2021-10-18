/* eslint-disable no-console */
import { Resource } from '../../commands/resources'
import axios from 'axios'
import { CommerceLayerStatic } from '@commercelayer/sdk'
import path from 'path'
import { writeFileSync } from 'fs'

const resUrl = 'https://core.commercelayer.io/api/public/resources'
const resFile = path.join(__dirname, 'schema.json')


const getResourcesJson = async (): Promise<any> => {

	let resources

	try {
		console.log(`Loading resources from remote url ${resUrl} ...`)
		const response = await axios.get(resUrl)
		resources = response.data
		writeFileSync(resFile, resources, { encoding: 'utf-8' })
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


const exportResources = async ({ source = 'sdk', variable = false, name = 'resources', array = false, tab = false, immutable = false } = {}): Promise<void> => {

	const resources = await ((source.toLowerCase() === 'sdk') ? parseResourcesSdk() : parseResourcesSchema())

	console.log('Parsed resources from source: ' + source)

	const lines: string[] = ['']

	if (variable || array) lines.push((variable ? `const ${name} = ` : '') + (array ? '[' : ''))

	const resLines = resources.map(res => {
		let item = `${tab ? '\t' : ''}{ `
		item += `name: '${res.name}', api: '${res.api}', model: '${res.model}'`
		if (res.singleton) item += ', singleton: true'
		item += ' },'
		return item
	})
	lines.push(...resLines)

	if (array) lines.push(`]${immutable ? ' as const' : ''}\n`)

	lines.push(`\n\nexport default ${name}\n`)

	writeFileSync(path.join(__dirname, 'available.ts'), lines.join('\n'), { encoding: 'utf-8' })

	console.log('Generated resource list')

}


const source = (process.argv.length > 2) ? (['sdk', 'online'].includes(process.argv[2]) ? process.argv[2] : 'sdk') : undefined

exportResources({ source, variable: true, name: 'RESOURCES', array: true, tab: true, immutable: true })
