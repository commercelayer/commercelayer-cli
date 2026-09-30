/** Test helpers: the shared ones from @commercelayer/cli-test-utils, plus this plugin's own. */
import { accessToken, ORG, resource } from '@commercelayer/cli-test-utils'

export { api, apiError, list, notFound, ORG, resource, single, useMockedApi } from '@commercelayer/cli-test-utils'

/** Organization and token flags every API command needs */
export const AUTH = ['-o', ORG, '--accessToken', accessToken()]

export const webhook = (id: string, attributes: Record<string, unknown> = {}) =>
  resource('webhooks', id, {
    name: 'Order placed',
    topic: 'orders.place',
    callback_url: 'https://hooks.example.com/orders',
    include_resources: ['customer', 'line_items'],
    circuit_state: 'closed',
    circuit_failure_count: 0,
    shared_secret: 's3cr3t',
    ...attributes,
  })

export const eventCallback = (id: string, attributes: Record<string, unknown> = {}) =>
  resource('event_callbacks', id, {
    callback_url: 'https://hooks.example.com/orders',
    payload: { data: { id: 'oRd1', type: 'orders' } },
    response_code: '200',
    response_message: 'OK',
    ...attributes,
  })
