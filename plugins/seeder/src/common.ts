import { join, resolve } from 'path'
import axios from 'axios'
import { readFileSync } from 'fs'
import { clConfig } from '@commercelayer/cli-core'


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



const requestsDelay = (requests: number, _type?: string): number => {
/*
  const noLimitResources = [
    'bundles',
    'external_promotions',
    'fixed_amount_promotions',
    'fixed_price_promotions',
    'free_gift_promotions',
    'free_shipping_promotions',
    'inventory_models',
    'markets',
    'percentage_discount_promotions',
    'price_lists',
    'prices',
    'sku_lists',
    'sku_list_items',
    'sku_options',
    'skus',
    'stock_items',
    'stock_locations',
  ]

  if (type && noLimitResources.includes(type)) return 0
*/
  const delayBurst = clConfig.api.requests_max_secs_burst / clConfig.api.requests_max_num_burst
  const delayAvg = clConfig.api.requests_max_secs_avg / clConfig.api.requests_max_num_avg

  const delay = (requests < clConfig.api.requests_max_num_avg) ? delayBurst : delayAvg

  return Math.ceil(delay) * 1000

}


export { getCommerceLayerDataFile, isRemotePath, pathJoin, requestsDelay }
