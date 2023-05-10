import { join, resolve } from 'path'
import axios from 'axios'
import { readFileSync } from 'fs'
import { type ApiMode, clConfig } from '@commercelayer/cli-core'


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



const requestsDelay = (requests: number, _type?: string, env?: ApiMode): number => {

  if (requests < clConfig.api.requests_max_num_burst) return 10

  const corrFact = (env === 'live')? 1 : 2

  const delayBurst = clConfig.api.requests_max_secs_burst / (clConfig.api.requests_max_num_burst / corrFact)
  const delayAvg = clConfig.api.requests_max_secs_avg / (clConfig.api.requests_max_num_avg / corrFact)

  const delay = (requests < clConfig.api.requests_max_num_avg) ? delayBurst : delayAvg

  return Math.ceil(delay) * 1000

}


export { getCommerceLayerDataFile, isRemotePath, pathJoin, requestsDelay }
