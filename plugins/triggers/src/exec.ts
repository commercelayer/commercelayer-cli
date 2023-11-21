import { clUtil } from '@commercelayer/cli-core'
import commercelayer, { type CommerceLayerClient, CommerceLayerStatic, type QueryParamsRetrieve } from '@commercelayer/sdk'
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


const exec = async (resourceType: string, id: string, action: string, flags: any, fields?: string[], config?: Config): Promise<any> => {

  const cl = commercelayerInit(flags, config)

  const res: any = { id }
  const trigger = `_${action}`
  res[trigger] = flags.value || true as unknown as undefined

  const params: QueryParamsRetrieve = {}
  if (fields && (fields.length > 0)) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    params.fields = {} as Record<string, string[]>
    params.fields[resourceType] = fields
  }

  const resSdk: any = cl[resourceType as keyof CommerceLayerClient]
  const result = resSdk.update(res, params).catch((error: unknown) => {
    if (CommerceLayerStatic.isApiError(error)) error.code = `RES_${resourceType}_${id}`
    throw error
  })

  return result

}


export default exec
