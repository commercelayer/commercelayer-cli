import { clApi } from '@commercelayer/cli-core'
import open from 'open'



const buildCheckoutUrl = (organization: string, id: string, accessToken: string): string => {
  const baseUrl = clApi.baseURL(organization, 'checkout.commercelayer.app')
  const checkoutUrl = `${baseUrl}/${id}?accessToken=${accessToken}`
  return checkoutUrl
}


const openCheckoutUrl = async (checkoutUrl: string) => {
  // return CliUx.ux.open(checkoutUrl)  // BUG in CliUx 07-02-2022 @oclif/core@1.3.1
  return open(checkoutUrl)
}


export { buildCheckoutUrl, openCheckoutUrl }
