import commercelayer, { CommerceLayerClient, CommerceLayerStatic, QueryParamsRetrieve } from '@commercelayer/sdk'



const commercelayerInit = (flags: any): CommerceLayerClient => {

  const organization = flags.organization
  const domain = flags.domain
  const accessToken = flags.accessToken

  return commercelayer({
    organization,
    domain,
    accessToken,
  })

}


const executeAction = async (resourceType: string, id: string, action: string, flags: any, fields?: string[]): Promise<any> => {

  const cl = commercelayerInit(flags)

  const res: any = { id }
  const trigger = `_${action}`
  res[trigger] = flags.value || true as unknown as undefined

  const params: QueryParamsRetrieve = {}
  if (fields && (fields.length > 0)) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    params.fields = {} as { [key: string]: string[] }
    params.fields[resourceType] = fields
  }

  const resSdk: any = cl[resourceType as keyof CommerceLayerClient]
  const result = resSdk.update(res, params).catch((error: unknown) => {
    if (CommerceLayerStatic.isApiError(error)) error.code = `RES_${resourceType}_${id}`
    throw error
  })

  return result

}


export default executeAction
