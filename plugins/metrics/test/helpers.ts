/**
 * Test helpers: the commands run for real against a mocked Metrics API.
 *
 * Real network access is disabled, so a missing mock fails the test instead
 * of reaching the API.
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
export const token = (kind = 'integration', slug = ORG) =>
  jwt({ organization: { slug, id: 'OrgId' }, application: { kind, id: 'AppId' }, scope: 'market:all' })

/** Organization and token flags every API command needs */
export const AUTH = ['-o', ORG, '-a', token()]

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

/** Mocks one Metrics API query and captures its body */
export const mockQuery = (path: string, status: number, response: unknown): { body?: any } => {
  const captured: { body?: any } = {}
  nock(API)
    .post(`/metrics/${path}`, (body) => {
      captured.body = body
      return true
    })
    .matchHeader('authorization', (h) => h.startsWith('Bearer '))
    .reply(status, response)
  return captured
}

export const apiError = (status: number, title: string) => ({ errors: [{ title, detail: title, code: 'ERROR', status: String(status) }] })
