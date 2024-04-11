import { clUtil } from '@commercelayer/cli-core'
import commercelayer, { CommerceLayerStatic } from '@commercelayer/sdk'
import type { CommerceLayerClient, Resource, QueryParamsRetrieve, QueryRecordFields } from '@commercelayer/sdk'
import { type Config } from '@oclif/core/lib/interfaces'



const commercelayerInit = (flags: any, config?: Config): CommerceLayerClient => {

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


const exec = async <R extends Resource>(resourceType: string, id: string, action: string, flags: any, fields?: string[], config?: Config): Promise<R> => {

  const cl = commercelayerInit(flags, config)

  const res: any = { id }
  const trigger = `_${action}`
  res[trigger] = flags.value || true as unknown as undefined

  const params: QueryParamsRetrieve = {}
  if (fields && (fields.length > 0)) {
    params.fields = {}
    params.fields[resourceType as R['type']] = fields as QueryRecordFields[R['type']]
  }

  const resSdk: any = cl[resourceType as keyof CommerceLayerClient]
  const result = resSdk.update(res, params).catch((error: unknown) => {
    if (CommerceLayerStatic.isApiError(error)) error.code = `RES_${resourceType}_${id}`
    throw error
  })

  return result

}


export default exec
