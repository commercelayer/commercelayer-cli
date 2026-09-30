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
export const AUTH = ['-o', ORG, '--accessToken', TOKEN]

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

export const tag = (id: string, name: string) => resource('tags', id, { name, reference: null, reference_origin: null, metadata: {} })

export const single = (data: unknown, included?: unknown[]) => ({ data, ...(included ? { included } : {}) })

export const list = (data: unknown[], included?: unknown[]) => ({
  data,
  ...(included ? { included } : {}),
  meta: { record_count: data.length, page_count: data.length ? 1 : 0 },
})

export const notFound = () => ({ errors: [{ title: 'Record not found', detail: 'The requested resource was not found', code: 'RECORD_NOT_FOUND', status: '404' }] })

/** checkTag(): lookup by ID fails, then by name */
export const mockTagByName = (scope: nock.Scope, name: string, found?: ReturnType<typeof tag>): nock.Scope =>
  scope
    .get(`/api/tags/${name}`)
    .reply(404, notFound())
    .get('/api/tags')
    .query((q) => q['filter[q][name_eq]'] === name)
    .reply(200, list(found ? [found] : []))
