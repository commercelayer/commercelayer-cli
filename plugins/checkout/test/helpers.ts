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

const jwt = (payload: object) =>
  [
    Buffer.from(JSON.stringify({ alg: 'HS512', typ: 'JWT' })).toString('base64url'),
    Buffer.from(JSON.stringify(payload)).toString('base64url'),
    'signature',
  ].join('.')

/** An unsigned access token: the commands only decode it */
export const token = (kind = 'sales_channel', slug = ORG) => jwt({ organization: { slug, id: 'OrgId' }, application: { kind, id: 'AppId' }, scope: 'market:code:EU' })

export const TOKEN = token()

/** Organization and token flags every API command needs */
export const AUTH = ['-o', ORG, '-a', TOKEN]

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

export const single = (data: unknown, included?: unknown[]) => ({ data, ...(included ? { included } : {}) })

export const list = (data: unknown[], included?: unknown[]) => ({
  data,
  ...(included ? { included } : {}),
  meta: { record_count: data.length, page_count: data.length ? 1 : 0 },
})

export const apiError = (status: number, title: string, detail = title) => ({ errors: [{ title, detail, code: title.toUpperCase().replace(/\W+/g, '_'), status: String(status) }] })
