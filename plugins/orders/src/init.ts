import { clUtil } from '@commercelayer/cli-core'
import commercelayer, { type CommerceLayerClient } from '@commercelayer/sdk'
import type { Config } from '@oclif/core/lib/interfaces'


export const commercelayerInit = (flags: any, config?: Config): CommerceLayerClient => {

  const organization = flags.organization
  const domain = flags.domain
  const accessToken = flags.accessToken

  const userAgent = config? clUtil.userAgent(config) : undefined

  return commercelayer({
    organization,
    domain,
    accessToken,
    userAgent
  })

}
