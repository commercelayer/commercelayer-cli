import { clApi, clUtil } from '@commercelayer/cli-core'
import type { ApiVersion } from '@commercelayer/sdk'
import commercelayer, { type CommerceLayerClient } from '@commercelayer/sdk'
import type { Interfaces } from '@oclif/core'

type Config = Interfaces.Config


export const commercelayerInit = (flags: any, config?: Config): CommerceLayerClient => {

  const organization = flags.organization
  const domain = flags.domain
  const accessToken = flags.accessToken

  const userAgent = config? clUtil.userAgent(config) : undefined

  return commercelayer({
    apiVersion: clApi.apiVersion(flags) as ApiVersion,
    organization,
    domain,
    accessToken,
    userAgent
  })

}
