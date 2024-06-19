import { clApi, clConfig } from '@commercelayer/cli-core'
import type { ChildProcess } from 'node:child_process'
import open from 'open'


export type UrlOptions = {
  staging?: boolean
  domain?: string
}



const buildCheckoutUrl = (organization: string, orderId: string, accessToken: string, options: UrlOptions): string => {

  const subdomain = options.staging? 'stg.' : ''
  const domain = `${subdomain}${options.domain || clConfig.api.default_app_domain}`
  const baseUrl = clApi.baseURL('core', organization, domain)

  const checkoutUrl = `${baseUrl}/checkout/${orderId}?accessToken=${accessToken}`

  return checkoutUrl

}


const openCheckoutUrl = async (checkoutUrl: string): Promise<ChildProcess> => {
  return open(checkoutUrl)
}


export { buildCheckoutUrl, openCheckoutUrl }
