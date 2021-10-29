import commercelayer, { CommerceLayerClient, Order, OrderUpdate, QueryParamsRetrieve } from '@commercelayer/sdk'


type ActionType =
  'archive' |
  'unarchive' |
  'place' |
  'cancel' |
  'approve' |
  'approve_and_capture' |
  'authorize' |
  'capture' |
  'refund' |
  'update_taxes' |
  'shipping_address_same_as_billing' |
  'billing_address_same_as_shipping' |
  'save_payment_source_to_customer_wallet' |
  'save_shipping_address_to_customer_address_book' |
  'save_billing_address_to_customer_address_book'|
  'refresh'


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
  res[`_${action}`] = true

  const params: QueryParamsRetrieve = {}
  if (fields && (fields.length > 0)) params.fields = { orders: fields }

  const result = cl.orders.update(res, params)

  return result

}


export default executeAction
