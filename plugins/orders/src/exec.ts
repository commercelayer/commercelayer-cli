import commercelayer from '@commercelayer/sdk'
import type { CommerceLayerClient, Order, OrderUpdate, QueryParamsRetrieve } from '@commercelayer/sdk'
import type { ActionType } from './triggers'
import type { Config } from '@oclif/core/lib/interfaces'
import { clUtil } from '@commercelayer/cli-core'



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


const exec = async (id: string, action: ActionType, flags: any, fields?: string[], config?: Config): Promise<Order> => {

  const cl = commercelayerInit(flags, config)

  const res: OrderUpdate = { id }
  res[`_${action}`] = flags.value || true as unknown as undefined

  const params: QueryParamsRetrieve<Order> = {}
  if (fields && (fields.length > 0)) params.fields = { orders: fields as Array<keyof Order> }

  try {
    const result = await cl.orders.update(res, params)
    return result
  } catch (error: any) {
    error.id = id
    throw error
  }

}


export default exec
