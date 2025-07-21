import { clApi, clConfig } from '@commercelayer/cli-core'
import type { ChildProcess } from 'node:child_process'
import open from 'open'




const buildCheckoutUrl = (organization: string, orderId: string, accessToken: string, domain?: string): string => {

  let checkoutDomain = domain || clConfig.api.default_app_domain
  if (checkoutDomain.endsWith(clConfig.api.default_stg_domain)) checkoutDomain = `stg.${clConfig.api.default_app_domain}`
  const baseUrl = clApi.baseURL('core', organization, checkoutDomain)

  const checkoutUrl = `${baseUrl}/checkout/${orderId}?accessToken=${accessToken}`

  return checkoutUrl

}


const openCheckoutUrl = async (checkoutUrl: string): Promise<ChildProcess> => {
  return open(checkoutUrl)
}


export { buildCheckoutUrl, openCheckoutUrl }
