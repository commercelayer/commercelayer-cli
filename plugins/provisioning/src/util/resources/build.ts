/* eslint-disable no-console */
import type { Resource } from '../resources'
import { CommerceLayerProvisioningStatic } from '@commercelayer/provisioning-sdk'
import { join } from 'path'
import { writeFileSync } from 'fs'
import type { ResourceTypeLock } from '@commercelayer/provisioning-sdk'
import { clText } from '@commercelayer/cli-core'



const parseResourcesSdk = async (): Promise<Resource[]> => {

	const resList = CommerceLayerProvisioningStatic.resources().map(r => {
    const res = r as ResourceTypeLock
		const singular = clText.singularize(res)
		const item = {
			name: singular,
      type: res,
			api: CommerceLayerProvisioningStatic.isSingleton(res)? clText.singularize(res) : res,
			model: clText.camelize(singular),
			singleton: CommerceLayerProvisioningStatic.isSingleton(res),
		}
		return item
	})


	return resList

}


const exportResources = async ({ source = 'sdk', variable = false, name = 'resources', array = false, tab = false, immutable = false } = {}): Promise<void> => {

	if (source !== 'sdk') throw new Error(`Only 'sdk' source is currently supported`)
	const resources = await parseResourcesSdk()

	console.log('Parsed resources from source: ' + source)

	const lines: string[] = ['']

	if (variable || array) lines.push((variable ? `const ${name} = ` : '') + (array ? '[' : ''))

	const resLines = resources.map(res => {
		let item = `${tab ? '\t' : ''}{ `
		item += `name: '${res.name}', type: '${res.type}', api: '${res.api}', model: '${res.model}'`
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
