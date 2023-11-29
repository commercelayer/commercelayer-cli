/* eslint-disable no-console */
import type { Resource } from '../resources'
import axios from 'axios'
import { CommerceLayerStatic } from '@commercelayer/sdk'
import { join } from 'path'
import { writeFileSync } from 'fs'
import type { ResourceTypeLock } from '@commercelayer/sdk/lib/cjs/api'
import { clText } from '@commercelayer/cli-core'

const resUrl = 'https://core.commercelayer.io/api/public/resources'
const resFile = join(__dirname, 'schema.json')


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
	return (clText.singularize(res) === res)
}


const parseResourcesSchema = async (): Promise<Resource[]> => {

	const resJson = await getResourcesJson()

	if (resJson) {

		const resList = resJson.data.map((r: { id: string; attributes: { singleton: boolean } }) => {
			const item = {
				name: r.id,
				api: r.attributes.singleton ? r.id : clText.pluralize(r.id),
				model: clText.camelize(r.id),
				singleton: r.attributes.singleton,
			}
			return item
		})

		return resList

	}

	return []

}


const parseResourcesSdk = async (): Promise<Resource[]> => {

	const resList = CommerceLayerStatic.resources().map(r => {
		const singular = clText.singularize(r)
		const item = {
			name: singular,
			api: r as ResourceTypeLock,
			model: clText.camelize(singular),
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

	writeFileSync(join(__dirname, 'available.ts'), lines.join('\n'), { encoding: 'utf-8' })

	console.log('Generated resource list')

}


const source = (process.argv.length > 2) ? (['sdk', 'online'].includes(process.argv[2]) ? process.argv[2] : 'sdk') : undefined

void exportResources({ source, variable: true, name: 'RESOURCES', array: true, tab: true, immutable: true })
