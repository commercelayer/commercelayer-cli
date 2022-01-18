import { clApi } from '@commercelayer/cli-core'
import cliux from 'cli-ux'


const buildCheckoutUrl = (organization: string, id: string, accessToken: string): string => {
  const baseUrl = clApi.baseURL(organization, 'checkout.commercelayer.app')
  const checkoutUrl = `${baseUrl}/${id}?accessToken=${accessToken}`
  return checkoutUrl
}


const openCheckoutUrl = async (checkoutUrl: string) => {
  await cliux.open(checkoutUrl)
}


export { buildCheckoutUrl, openCheckoutUrl }
