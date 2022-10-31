import commercelayer, { CommerceLayerClient, Order, OrderUpdate, QueryParamsRetrieve } from '@commercelayer/sdk'
import { OutputFlags } from '@oclif/core/lib/interfaces'
import type { ActionType } from './triggers'



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


const executeAction = async (id: string, action: ActionType, flags: OutputFlags<any>, fields?: string[]): Promise<Order> => {

  const cl = commercelayerInit(flags)

  const res: OrderUpdate = { id }
  res[`_${action}`] = flags.value || true as unknown as undefined

  const params: QueryParamsRetrieve = {}
  if (fields && (fields.length > 0)) params.fields = { orders: fields }

  try {
    const result = await cl.orders.update(res, params)
    return result
  } catch (error: any) {
    error.id = id
    throw error
  }

}


export default executeAction
