import type { CommerceLayerClient, Order, OrderUpdate, QueryParamsRetrieve } from '@commercelayer/sdk'
import type { ActionType } from './triggers'
import type { Config } from '@oclif/core/lib/interfaces'
import { clColor } from '@commercelayer/cli-core'
import { CLIError } from '@oclif/core/lib/errors'
import { commercelayerInit } from './init'



export const checkOrder = async (cl: CommerceLayerClient, id: string): Promise<Order> => {
  const order = await cl.orders.retrieve(id).catch((err: Error) => {
    if (cl.isApiError(err) && (err.status === 404)) throw new CLIError(`Invalid order or order not found: ${clColor.msg.error(id)}`)
    else throw err
  })
  return order
}




const exec = async (id: string, action: ActionType, flags: any, fields?: string[], config?: Config): Promise<Order> => {

  const cl = commercelayerInit(flags, config)

  await checkOrder(cl, id)

  const res: OrderUpdate = { id, [`_${action}`]: flags.value || true }
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
