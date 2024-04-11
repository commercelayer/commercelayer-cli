import { clApi, clConfig } from '@commercelayer/cli-core'
import type { ChildProcess } from 'node:child_process'
import open from 'open'



const buildCheckoutUrl = (organization: string, orderId: string, accessToken: string, staging?: boolean): string => {

  const subdomain = staging? 'stg.' : ''
  const domain = `${subdomain}${clConfig.api.default_app_domain}`
  const baseUrl = clApi.baseURL('core', organization, domain)

  const checkoutUrl = `${baseUrl}/checkout/${orderId}?accessToken=${accessToken}`

  return checkoutUrl

}


const openCheckoutUrl = async (checkoutUrl: string): Promise<ChildProcess> => {
  return open(checkoutUrl)
}


export { buildCheckoutUrl, openCheckoutUrl }
