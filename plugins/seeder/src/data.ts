
import config from './config'
import { getCommerceLayerDataFile, pathJoin } from './common'
import chalk from 'chalk'



type SeederResource = {
  resourceType: string;
} & (
    {
      referenceKeys: Array<string>;
      importAll?: false;
    } | {
      importAll: true;
    }
  )

type BusinessModel = Array<SeederResource>

type ResourceData= Omit<{
  [key: string]: string | boolean | number | object;
}, 'reference' | 'reference_origin' | 'type'> & {
  type?: string;
  reference: string;
  reference_origin?: string;
}

type ResourceDataCollection = Array<ResourceData>

type ResourceMap = { [reference: string]: ResourceData }

type ResourceCache = { [resourceType: string]: ResourceMap }


export { SeederResource, ResourceData, BusinessModel }


const fileCache: ResourceCache = {}


const cache = (resourceType: string, fileData?: ResourceDataCollection): ResourceMap => {
  if (fileData) {
    const resourceMap: ResourceMap = {}
    fileData.forEach(r => {
      resourceMap[r.reference] = r
    })
    return resourceMap
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
    throw new Error(`Error reading data file from ${chalk.yellowBright(url)}`)
  })

  // Validation
  let index = 0
  for (const md of modelData) {
    index++
    if (!md.resourceType) throw new Error(`Missing field ${chalk.redBright('resourceType')} in business model item ${index}`)
    if (!md.importAll && !md.referenceKeys) throw new Error(`Missing one of ${chalk.redBright('importAll')} and ${chalk.redBright('referenceKeys')} in business model item ${index}`)
    if (!md.importAll && !Array.isArray(md.referenceKeys)) throw new Error(`Field ${chalk.redBright('referenceKeys')} in item ${index} must be an array`)
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



export { readModelData, readResourceData }
