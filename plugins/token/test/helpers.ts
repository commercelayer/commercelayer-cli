/** Test helpers: the shared ones from @commercelayer/cli-test-utils, plus this plugin's own. */
import { AUTH_API, api, jwt, ORG } from '@commercelayer/cli-test-utils'

export { AUTH_API, ORG, useMockedApi } from '@commercelayer/cli-test-utils'

export const CLIENT_ID = 'clientIdXYZ'
export const CLIENT_SECRET = 'clientSecretXYZ'

/** A complete access token, header included */
export const token = (payload: Record<string, unknown> = {}) =>
  jwt(
    {
      organization: { id: 'OrgId', slug: ORG, enterprise: false, region: 'eu-west-1' },
      application: { id: 'AppId', client_id: CLIENT_ID, kind: 'integration', public: false },
      scope: 'market:all',
      test: true,
      exp: 4102444800, // 2100-01-01
      rand: 0.5,
      ...payload,
    },
    { alg: 'HS512', typ: 'JWT', kid: 'kid1' },
  )

/** A nock scope on the OAuth endpoint */
export const auth = () => api(AUTH_API)

export const tokenResponse = (accessToken = token()) => ({
  access_token: accessToken,
  token_type: 'bearer',
  expires_in: 14400,
  scope: 'market:all',
  created_at: 1760000000,
})
