/** Test helpers: the shared ones from @commercelayer/cli-test-utils, plus this plugin's own. */
import { accessToken, coreApi, ORG, resource } from '@commercelayer/cli-test-utils'

export { api, apiError, list, ORG, resource, single, useMockedApi } from '@commercelayer/cli-test-utils'

export const API = coreApi()
export const TOKEN = accessToken()
/** Organization and token flags every API command needs */
export const AUTH = ['-o', ORG, '-a', TOKEN]

/** A sales channel client_id: the commands check its length */
export const CLIENT_ID = 'a'.repeat(43)

export const link = (id: string, attributes: Record<string, unknown> = {}, item = { type: 'skus', id: 'skuId' }) =>
  resource(
    'links',
    id,
    {
      name: 'Summer link',
      client_id: CLIENT_ID,
      scope: 'market:id:mkT1',
      starts_at: '2026-06-01T00:00:00.000Z',
      expires_at: '2026-09-01T00:00:00.000Z',
      active: true,
      status: 'active',
      domain: 'c11r.link',
      url: `https://${ORG}.c11r.link/${id}`,
      ...attributes,
    },
    { item: { data: item } },
  )
