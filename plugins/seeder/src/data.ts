
import config from './config'
import { getCommerceLayerDataFile, isRemotePath, pathJoin } from './common'
import { clColor } from '@commercelayer/cli-core'



type SeederResource = {
  resourceType: string;
} & (
    {
      referenceKeys: string[];
      importAll?: false;
    } | {
      importAll: true;
    }
  )

type BusinessModel = SeederResource[]

type ResourceData = Omit<Record<string, string | boolean | number | object>, 'reference' | 'reference_origin' | 'type'>
  & {
    type?: string;
    reference: string;
    reference_origin?: string;
  }

type ResourceDataCollection = ResourceData[]

type ResourceMap = Record<string, ResourceData>

type ResourceCache = Record<string, ResourceMap>


export type { SeederResource, ResourceData, BusinessModel }


const fileCache: ResourceCache = {}


const cache = (resourceType: string, fileData?: ResourceDataCollection): ResourceMap => {
  if (fileData) {
    const resourceMap: ResourceMap = {}
    fileData.forEach(r => {
      resourceMap[r.reference] = r
    })
    fileCache[resourceType] = resourceMap
  }
  return fileCache[resourceType]
}


const readSeederFile = async (url: string, file: string): Promise<BusinessModel | ResourceDataCollection> => {
  const dataFile: BusinessModel | ResourceDataCollection = await getCommerceLayerDataFile(url, file)
  return dataFile
}



const readModelData = async (url: string, model: string): Promise<BusinessModel> => {

  const fileName = model + '.json'
  const modelData = await readSeederFile(url, fileName).catch(() => {
    throw new Error(`Unable to read data file ${clColor.style.path(fileName)} from ${isRemotePath(url) ? 'url' : 'path'} ${clColor.style.path(url)}`)
  })

  // Validation
  let index = 0
  for (const md of modelData) {
    index++
    if (!md.resourceType) throw new Error(`Missing field ${clColor.msg.error('resourceType')} in business model item ${index}`)
    if (!md.importAll && !md.referenceKeys) throw new Error(`Missing one of ${clColor.msg.error('importAll')} and ${clColor.msg.error('referenceKeys')} in business model item ${index}`)
    if (!md.importAll && !Array.isArray(md.referenceKeys)) throw new Error(`Field ${clColor.msg.error('referenceKeys')} in item ${index} must be an array`)
  }

  return modelData as BusinessModel

}


const readResourceData = async (url: string, resource: string): Promise<ResourceMap> => {

  const fileName = resource + '.json'

  const cachedData = cache(resource)
  if (cachedData) return cachedData

  const resourceCollection = await readSeederFile(pathJoin(url, config.dataFolder), fileName)

  return cache(resource, resourceCollection as ResourceDataCollection)

}


const getResource = async (url: string, type: string, reference: string): Promise<ResourceData | undefined> => {
  const resMap = await readResourceData(url, type)
  return resMap[reference]
}


const modelIndex = (model: BusinessModel, type: string, reference: string): number => {
  return model.findIndex(res => {
    return (res.resourceType === type) && (res.importAll || res.referenceKeys.includes(reference))
  })
}



export { readModelData, readResourceData, getResource, modelIndex }
