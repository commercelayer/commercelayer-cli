import type { ResourceTypeLock } from '@commercelayer/provisioning-sdk'
import RESOURCES from './available'


interface ApiResource {
	name: string
  type: ResourceTypeLock
	api: string
	model: string
	singleton?: boolean
}


const resources: readonly ApiResource[] = RESOURCES



const findResource = (res: string, { singular = false } = {}): (ApiResource | undefined) => {
	if (res === undefined) return undefined
	const lowRes = res.toLowerCase()
	return resources.find(r => {
		return (lowRes === r.api) || (singular && (lowRes === r.name))
	})
}


const resourceList = (field: 'name' | 'api' | 'model'): string[] => {
	return resources.map(r => r[field])
}


export { findResource, resourceList, type ApiResource as Resource }
