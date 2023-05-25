import { join, resolve } from 'path'
import axios from 'axios'
import { readFileSync } from 'fs'
import { type ApiMode, clApi } from '@commercelayer/cli-core'


const isRemotePath = (path: string): boolean => {
  return path.startsWith('http://') || path.startsWith('https://')
}


const pathJoin = (base: string, seg: string): string => {
  if (isRemotePath(base)) return (base.endsWith('/') ? base : (base + '/')) + seg
  return join(base, seg)
}


const getCommerceLayerDataFile = async (url: string, file: string): Promise<any> => {

  const fileName = file.endsWith('.json') ? file : file + '.json'
  const filePath = pathJoin(url, fileName)

  let dataFile: any

  if (isRemotePath(url)) {
    const remFile = await axios.get(filePath)
    dataFile = remFile.data
  } else {
    const locFile = readFileSync(resolve(filePath), { encoding: 'utf-8' })
    dataFile = JSON.parse(locFile)
  }

  return dataFile

}



type ResourceTypeNumber= {
  cacheableTypes?: string[];
  cacheable: number;
  uncacheableTypes?: string[]
  uncacheable: number;
}


const requestsDelay = (resources: ResourceTypeNumber, env?: ApiMode): ResourceTypeNumber => {

  const cacheableDelay = clApi.requestRateLimitDelay({
    totalRequests: resources.cacheable,
    resourceType: (resources.cacheableTypes && (resources.cacheableTypes.length > 0)) ? resources.cacheableTypes[0] : undefined,
    environment: env,
  })

  const uncacheableDelay = clApi.requestRateLimitDelay({
    totalRequests: resources.uncacheable,
    resourceType: (resources.uncacheableTypes && (resources.uncacheableTypes.length > 0)) ? resources.uncacheableTypes[0] : undefined,
    environment: env,
  })

  return {
    cacheable: cacheableDelay,
    cacheableTypes: resources.cacheableTypes,
    uncacheable: uncacheableDelay,
    uncacheableTypes: resources.uncacheableTypes
  }

}


export { getCommerceLayerDataFile, isRemotePath, pathJoin, requestsDelay }
export type { ResourceTypeNumber }
