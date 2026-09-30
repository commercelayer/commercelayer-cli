/**
 * Test helpers: the commands run for real against a mocked Core API.
 *
 * nock is imported directly (not through @oclif/test's `.nock()`, which loads
 * nock 13 and can't intercept the SDK's native fetch), and real network
 * access is disabled, so a missing mock fails the test instead of reaching
 * the API.
 */
import nock from 'nock'

export const ORG = 'test-org'
export const API = `https://${ORG}.commercelayer.io`

/** An unsigned access token: the commands only decode it */
export const TOKEN = [
  Buffer.from(JSON.stringify({ alg: 'HS512', typ: 'JWT' })).toString('base64url'),
  Buffer.from(JSON.stringify({ organization: { slug: ORG, id: 'OrgId' }, application: { kind: 'integration', id: 'AppId' }, scope: 'market:all' })).toString('base64url'),
  'signature',
].join('.')

/** Organization and token flags every API command needs */
export const AUTH = ['-o', ORG, '-a', TOKEN]

/** A sales channel client_id: the commands check its length */
export const CLIENT_ID = 'a'.repeat(43)

/** Registers the hooks that block the network and reset the mocks */
export const useMockedApi = (): void => {
  before(() => {
    nock.disableNetConnect()
  })
  afterEach(() => {
    nock.cleanAll()
  })
  after(() => {
    nock.enableNetConnect()
  })
}

export const api = (): nock.Scope => nock(API)

type Attributes = Record<string, unknown>

export const resource = (type: string, id: string, attributes: Attributes = {}, relationships?: Record<string, unknown>) => ({
  id,
  type,
  attributes: { created_at: '2026-01-01T10:00:00.000Z', updated_at: '2026-01-02T10:00:00.000Z', ...attributes },
  ...(relationships ? { relationships } : {}),
})

export const link = (id: string, attributes: Attributes = {}, item = { type: 'skus', id: 'skuId' }) =>
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

export const single = (data: unknown, included?: unknown[]) => ({ data, ...(included ? { included } : {}) })

export const list = (data: unknown[], included?: unknown[]) => ({
  data,
  ...(included ? { included } : {}),
  meta: { record_count: data.length, page_count: data.length ? 1 : 0 },
})

export const apiError = (status: number, title: string, detail = title) => ({ errors: [{ title, detail, code: title.toUpperCase().replace(/\W+/g, '_'), status: String(status) }] })
