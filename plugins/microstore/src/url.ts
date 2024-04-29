import { clApi, clConfig } from '@commercelayer/cli-core'
import type { ChildProcess } from 'child_process';
import open from 'open'


type MicrostoreOptions = {
  all: boolean;
} & (
  {
    cart: false | undefined;
  }
  |
  {
    cart: true;
    inline: boolean | undefined;
  }
)


// eslint-disable-next-line max-params
const buildMicrostoreUrl = (organization: string, domain: string | undefined, skuListId: string, accessToken: string, options: MicrostoreOptions): string => {

  const baseUrl = clApi.baseURL('core', organization, domain || clConfig.api.default_app_domain)

  let microstoreUrl = `${baseUrl}/microstore/list/${skuListId}?accessToken=${accessToken}`
  if (options.all) microstoreUrl += '&all=true'
  if (options.cart) microstoreUrl += '&cart=true'
  if (options.cart && options.inline) microstoreUrl += '&inline=true'

  return microstoreUrl

}


const openMicrostoreUrl = async (microstoreUrl: string): Promise<ChildProcess> => {
  return open(microstoreUrl)
}


export { buildMicrostoreUrl, openMicrostoreUrl }
