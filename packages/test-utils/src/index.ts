/**
 * Test utilities shared by the CLI packages' test suites.
 *
 * The commands run for real against a mocked Commerce Layer API: nock is used
 * directly (not through @oclif/test's `.nock()`, which loads nock 13 and
 * can't intercept the SDK's native fetch), and real network access is
 * disabled, so a missing mock fails the test instead of reaching the API.
 */
import nock from 'nock'

/** The organization the tests run against */
export const ORG = 'test-org'

/** Base URL of the Core API (and of the Metrics API) of an organization */
export const coreApi = (org = ORG): string => `https://${org}.commercelayer.io`

export const PROVISIONING_API = 'https://provisioning.commercelayer.io'
export const AUTH_API = 'https://auth.commercelayer.io'

/** Registers the mocha hooks that block the network and reset the mocks */
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

/** A nock scope on the Core API of the test organization */
/** The version segment of the Core API paths (/api/2026-05/…) */
const API_VERSION_SEGMENT = /^\/api\/\d{4}-\d{2}\//

/**
 * A mock of the API. The requests of SDK 8 carry the Core API version in
 * their path (/api/2026-05/orders): the mocks are written for /api/orders and
 * match whatever version the CLI uses (versionedApi checks the version).
 */
export const api = (base: string = coreApi()): nock.Scope => nock(base).filteringPath((path) => path.replace(API_VERSION_SEGMENT, '/api/'))

/** A mock of the API that matches the exact request path, version included */
export const versionedApi = (base: string = coreApi()): nock.Scope => nock(base)

/** An unsigned JWT: the CLI commands only decode access tokens */
export const jwt = (payload: object, header: object = { alg: 'HS512', typ: 'JWT' }): string =>
  [Buffer.from(JSON.stringify(header)).toString('base64url'), Buffer.from(JSON.stringify(payload)).toString('base64url'), 'signature'].join('.')

/** An access token of an application of the given kind and organization */
export const accessToken = ({ kind = 'integration', org = ORG, ...extra }: { kind?: string; org?: string; [claim: string]: unknown } = {}): string =>
  jwt({ organization: { slug: org, id: 'OrgId' }, application: { kind, id: 'AppId' }, scope: 'market:all', ...extra })

type Attributes = Record<string, unknown>

/** A JSON:API resource object */
export const resource = (type: string, id: string, attributes: Attributes = {}, relationships?: Record<string, unknown>) => ({
  id,
  type,
  attributes: { created_at: '2026-01-01T10:00:00.000Z', updated_at: '2026-01-02T10:00:00.000Z', ...attributes },
  ...(relationships ? { relationships } : {}),
})

/** A JSON:API single-resource document */
export const single = (data: unknown, included?: unknown[]) => ({ data, ...(included ? { included } : {}) })

/** A JSON:API collection document, one page */
export const list = (data: unknown[], included?: unknown[]) => ({
  data,
  ...(included ? { included } : {}),
  meta: { record_count: data.length, page_count: data.length ? 1 : 0 },
})

/** A JSON:API error document */
export const apiError = (status: number, title: string, detail = title) => ({
  errors: [{ title, detail, code: title.toUpperCase().replace(/\W+/g, '_'), status: String(status) }],
})

export const notFound = () => apiError(404, 'Record not found', 'The requested resource was not found')
