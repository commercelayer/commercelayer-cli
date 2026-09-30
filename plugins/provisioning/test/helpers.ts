/**
 * Test helpers: the commands run for real against a mocked Provisioning API.
 *
 * nock is imported directly (not through @oclif/test's `.nock()`, which loads
 * nock 13 and can't intercept the SDK's native fetch), and real network
 * access is disabled, so a missing mock fails the test instead of reaching
 * the API.
 */
import nock from 'nock'

export const API = 'https://provisioning.commercelayer.io'

/** An unsigned access token: the commands only decode it */
export const TOKEN = [
  Buffer.from(JSON.stringify({ alg: 'HS512', typ: 'JWT' })).toString('base64url'),
  Buffer.from(JSON.stringify({ user: { id: 'UsrId' }, application: { kind: 'user', id: 'AppId' }, scope: 'provisioning-api' })).toString('base64url'),
  'signature',
].join('.')

/** The token flag every API command needs */
export const AUTH = ['--accessToken', TOKEN]

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

export const resource = (type: string, id: string, attributes: Record<string, unknown> = {}, relationships?: Record<string, unknown>) => ({
  id,
  type,
  attributes: { created_at: '2026-01-01T10:00:00.000Z', updated_at: '2026-01-02T10:00:00.000Z', ...attributes },
  ...(relationships ? { relationships } : {}),
})

export const single = (data: unknown, included?: unknown[]) => ({ data, ...(included ? { included } : {}) })

export const list = (data: unknown[]) => ({ data, meta: { record_count: data.length, page_count: data.length ? 1 : 0 } })

export const apiError = (status: number, title: string, detail = title) => ({ errors: [{ title, detail, code: 'ERROR', status: String(status) }] })
