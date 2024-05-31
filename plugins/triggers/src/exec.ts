import { clApi, clColor, clText, clUtil } from '@commercelayer/cli-core'
import commercelayer, { CommerceLayerStatic } from '@commercelayer/sdk'
import type { CommerceLayerClient, Resource, QueryParamsRetrieve, QueryRecordFields } from '@commercelayer/sdk'
import { CLIError } from '@oclif/core/lib/errors'
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

  const resSdk: any = cl[resourceType as keyof CommerceLayerClient]
  await cl.orders.retrieve(id).catch(err => {
    const resource = clApi.humanizeResource(clText.singularize(resourceType))
    if (cl.isApiError(err) && (err.status === 404)) throw new CLIError(`Invalid ${resource} or ${resource} not found: ${clColor.msg.error(id)}`)
  })

  const res: any = { id, [`_${action}`]: flags.value || true }
  const params: QueryParamsRetrieve = {}
  if (fields && (fields.length > 0)) {
    params.fields = {}
    params.fields[resourceType as R['type']] = fields as QueryRecordFields[R['type']]
  }

  const result = resSdk.update(res, params).catch((error: unknown) => {
    if (CommerceLayerStatic.isApiError(error)) error.code = `RES_${resourceType}_${id}`
    throw error
  })

  return result

}


export default exec
