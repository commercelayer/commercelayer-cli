import { AUTH_API, api, jwt, useMockedApi } from '@commercelayer/cli-test-utils'
import { expect } from 'chai'
import jsonwebtoken from 'jsonwebtoken'
import {
  type AccessToken,
  type AccessTokenInfo,
  buildAssertionPayload,
  decodeAccessToken,
  generateAccessToken,
  getAccessToken,
  getTokenEnvironment,
  isAccessTokenExpiring,
  revokeAccessToken,
} from '../../src/token'

describe('token', () => {
  const info: AccessTokenInfo = {
    organization: { id: 'OrgId', slug: 'acme' },
    application: { id: 'AppId', kind: 'integration', public: false },
    test: true,
  }

  it('decodes an access token', () => {
    expect(decodeAccessToken(jwt(info))).to.deep.equal(info)
    expect(() => decodeAccessToken('not a token')).to.throw('Error decoding access token')
  })

  it('tells the environment of a token', () => {
    expect(getTokenEnvironment(jwt(info))).to.equal('test')
    expect(getTokenEnvironment({ ...info, test: false })).to.equal('live')
  })

  it('generates a custom token signed with the shared secret', () => {
    const before = Math.floor(Date.now() / 1000)
    const token = generateAccessToken(info, 'secret', 10)
    expect(token.expMinutes).to.equal(10)
    expect(token.info).to.include({ test: true })
    expect(token.info.exp).to.be.within(before + 600, before + 601)
    expect(jsonwebtoken.verify(token.accessToken, 'secret', { algorithms: ['HS512'] })).to.include({ test: true })
    expect(() => jsonwebtoken.verify(token.accessToken, 'other')).to.throw()
  })

  it('tells when a token is about to expire', () => {
    const expiring = (secs: number) => ({ expires: new Date(Date.now() + secs * 1000) }) as AccessToken
    expect(isAccessTokenExpiring(expiring(10))).to.equal(true)
    expect(isAccessTokenExpiring(expiring(-10))).to.equal(true)
    expect(isAccessTokenExpiring(expiring(120))).to.equal(false)
  })

  describe('buildAssertionPayload', () => {
    const CLAIM = 'https://commercelayer.io/claims'

    it('builds the owner claim', () => {
      expect(buildAssertionPayload('Customer', 'cust1')).to.deep.equal({ [CLAIM]: { owner: { type: 'Customer', id: 'cust1' } } })
    })

    it('adds the custom claim expanding dot notation', () => {
      expect(buildAssertionPayload('User', 'u1', { 'tier.level': 'gold' })[CLAIM].custom_claim).to.deep.equal({ tier: { level: 'gold' } })
    })
  })

  describe('getAccessToken', () => {
    useMockedApi()

    const tokenResponse = { access_token: 'tok', token_type: 'bearer', expires_in: 7200, scope: 'market:1', created_at: 1 }

    it('uses the client credentials grant', async () => {
      api(AUTH_API)
        .post('/oauth/token', (b) => b.grant_type === 'client_credentials' && b.client_id === 'cid' && b.scope === 'market:1,market:2')
        .reply(200, tokenResponse)
      const token = await getAccessToken({ clientId: 'cid', clientSecret: 'secret', scope: [' market:1', 'market:2 '] })
      expect(token.accessToken).to.equal('tok')
      expect(token.expires).to.be.instanceOf(Date)
    })

    it('uses the password grant with email and password', async () => {
      api(AUTH_API)
        .post('/oauth/token', (b) => b.grant_type === 'password' && b.username === 'jane@example.com' && b.password === 'pwd')
        .reply(200, tokenResponse)
      expect((await getAccessToken({ clientId: 'cid', email: 'jane@example.com', password: 'pwd' })).accessToken).to.equal('tok')
    })

    it('uses the JWT bearer grant with an assertion', async () => {
      api(AUTH_API)
        .post('/oauth/token', (b) => b.grant_type === 'urn:ietf:params:oauth:grant-type:jwt-bearer' && b.assertion === 'jwt')
        .reply(200, tokenResponse)
      expect((await getAccessToken({ clientId: 'cid', assertion: 'jwt' })).accessToken).to.equal('tok')
    })

    it('uses the domain of the application', async () => {
      api('https://auth.commercelayer.co').post('/oauth/token').reply(200, tokenResponse)
      expect((await getAccessToken({ clientId: 'cid', domain: 'commercelayer.co' })).accessToken).to.equal('tok')
    })

    it('throws the error of the authentication', async () => {
      api(AUTH_API)
        .post('/oauth/token')
        .reply(401, { errors: [{ title: 'Unauthorized', detail: 'Invalid client', code: 'UNAUTHORIZED', status: 401 }] })
      let error: Error | undefined
      try {
        await getAccessToken({ clientId: 'cid' })
      } catch (e) {
        error = e as Error
      }
      expect(error?.message).to.equal('Unable to get access token: Invalid client')
    })
  })

  describe('revokeAccessToken', () => {
    useMockedApi()

    it('revokes the token', async () => {
      api(AUTH_API).post('/oauth/revoke', (b) => b.client_id === 'cid' && b.token).reply(200, {})
      await revokeAccessToken({ clientId: 'cid' }, jwt(info))
    })

    it('throws the error of the revocation', async () => {
      api(AUTH_API)
        .post('/oauth/revoke')
        .reply(200, { errors: [{ detail: 'Token not revocable' }] })
      let error: Error | undefined
      try {
        await revokeAccessToken({ clientId: 'cid' }, jwt(info))
      } catch (e) {
        error = e as Error
      }
      expect(error?.message).to.equal('Token not revocable')
    })
  })
})
