import { clApi, clConfig } from '@commercelayer/cli-core'
import { ChildProcess } from 'node:child_process'
import open from 'open'



const buildCheckoutUrl = (organization: string, id: string, accessToken: string, staging?: boolean): string => {
  const subdomain = staging ? 'checkout-stg' : 'checkout'
  const baseUrl = clApi.baseURL(organization, `${subdomain}.${clConfig.api.default_app_domain}`)
  const checkoutUrl = `${baseUrl}/${id}?accessToken=${accessToken}`
  return checkoutUrl
}


const openCheckoutUrl = async (checkoutUrl: string): Promise<ChildProcess> => {
  // return CliUx.ux.open(checkoutUrl)  // BUG in CliUx 07-02-2022 @oclif/core@1.3.1
  return open(checkoutUrl)
}


export { buildCheckoutUrl, openCheckoutUrl }
