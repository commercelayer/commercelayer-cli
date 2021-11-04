import commercelayer, { CommerceLayerClient, Order, OrderUpdate, QueryParamsRetrieve } from '@commercelayer/sdk'
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


const executeAction = (id: string, action: ActionType, flags: any, fields?: string[]): Promise<Order> => {

  const cl = commercelayerInit(flags)

  const res: OrderUpdate = { id }
  res[`_${action}`] = flags.value || true as unknown as undefined

  const params: QueryParamsRetrieve = {}
  if (fields && (fields.length > 0)) params.fields = { orders: fields }

  const result = cl.orders.update(res, params)

  return result

}


export default executeAction
