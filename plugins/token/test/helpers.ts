/**
 * Test helpers: the commands run for real against a mocked OAuth endpoint.
 *
 * Real network access is disabled, so a missing mock fails the test instead
 * of reaching the API.
 */
import nock from 'nock'

export const ORG = 'test-org'
export const AUTH_API = 'https://auth.commercelayer.io'
export const CLIENT_ID = 'clientIdXYZ'
export const CLIENT_SECRET = 'clientSecretXYZ'

/** An unsigned access token: the commands only decode it */
export const token = (payload: Record<string, unknown> = {}) =>
  [
    Buffer.from(JSON.stringify({ alg: 'HS512', typ: 'JWT', kid: 'kid1' })).toString('base64url'),
    Buffer.from(
      JSON.stringify({
        organization: { id: 'OrgId', slug: ORG, enterprise: false, region: 'eu-west-1' },
        application: { id: 'AppId', client_id: CLIENT_ID, kind: 'integration', public: false },
        scope: 'market:all',
        test: true,
        exp: 4102444800, // 2100-01-01
        rand: 0.5,
        ...payload,
      }),
    ).toString('base64url'),
    'signature',
  ].join('.')

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

export const auth = (): nock.Scope => nock(AUTH_API)

export const tokenResponse = (accessToken = token()) => ({
  access_token: accessToken,
  token_type: 'bearer',
  expires_in: 14400,
  scope: 'market:all',
  created_at: 1760000000,
})
