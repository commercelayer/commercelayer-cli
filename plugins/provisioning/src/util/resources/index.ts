import type { ResourceTypeLock } from '@commercelayer/provisioning-sdk/lib/cjs/api'
import RESOURCES from './available'


interface Resource {
	name: string;
	api: ResourceTypeLock;
	model: string;
	singleton?: boolean;
}


const resources: readonly Resource[] = RESOURCES



const findResource = (res: string, { singular = false } = {}): (Resource | undefined) => {
	if (res === undefined) return undefined
	const lowRes = res.toLowerCase()
	return resources.find(r => {
		return (lowRes === r.api) || (singular && (lowRes === r.name))
	})
}


const resourceList = (field: 'name' | 'api' | 'model'): string[] => {
	return resources.map(r => r[field])
}


export { findResource, resourceList, type Resource }
