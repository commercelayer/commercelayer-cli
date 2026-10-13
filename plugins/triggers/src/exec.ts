import { clApi, clColor, clText, clUtil } from '@commercelayer/cli-core'
import type { ApiVersion, CommerceLayerClient, QueryParamsRetrieve, Resource } from '@commercelayer/sdk'
import commercelayer, { CommerceLayerStatic } from '@commercelayer/sdk'
import type { Interfaces } from '@oclif/core'
import { Errors } from '@oclif/core'

const { CLIError } = Errors
type Config = Interfaces.Config



const commercelayerInit = (flags: any, config?: Config): CommerceLayerClient => {

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


const exec = async <R extends Resource>(resourceType: string, id: string, action: string, flags: any, fields?: string[], config?: Config): Promise<R> => {

  const cl = commercelayerInit(flags, config)

  const resSdk: any = cl[resourceType as keyof CommerceLayerClient]
  await resSdk.retrieve(id).catch((err: any) => {
    if (cl.isApiError(err) && (err.status === 404)) {
      const resource = clApi.humanizeResource(clText.singularize(resourceType))
      throw new CLIError(`Invalid ${resource} or ${resource} not found: ${clColor.msg.error(id)}`)
    }
  })

  const res: any = { id, [`_${action}`]: flags.value || true }
  const params: QueryParamsRetrieve = {}
  if (fields && (fields.length > 0)) {
    params.fields = { [resourceType]: fields } as QueryParamsRetrieve['fields']
  }

  const result = resSdk.update(res, params).catch((error: unknown) => {
    if (CommerceLayerStatic.isApiError(error)) error.code = `RES_${resourceType}_${id}`
    throw error
  })

  return result

}


export default exec
