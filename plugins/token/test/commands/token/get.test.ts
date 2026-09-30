import { expect, test } from '@oclif/test'
import { auth, CLIENT_ID, CLIENT_SECRET, ORG, token, tokenResponse, useMockedApi } from '../../helpers'

describe('token:get', () => {
  useMockedApi()

  const accessToken = token()

  test
    .do(() => {
      auth()
        .post('/oauth/token', (body) => body.grant_type === 'client_credentials' && body.client_id === CLIENT_ID && body.client_secret === CLIENT_SECRET)
        .reply(200, tokenResponse(accessToken))
    })
    .stdout()
    .command(['token:get', '-o', ORG, '-i', CLIENT_ID, '-s', CLIENT_SECRET])
    .it('gets an access token with client credentials', (ctx) => {
      expect(ctx.stdout).to.contain(`Access token for integration application of organization ${ORG}`)
      expect(ctx.stdout).to.contain(accessToken)
    })

  test
    .do(() => {
      auth()
        .post('/oauth/token', (body) => body.grant_type === 'client_credentials' && body.scope === 'market:code:EU')
        .reply(200, tokenResponse(token({ application: { kind: 'sales_channel' } })))
    })
    .stdout()
    .command(['token:get', '-o', ORG, '-i', CLIENT_ID, '-S', 'market:code:EU', '--info'])
    .it('gets a scoped sales channel token and shows its info', (ctx) => {
      expect(ctx.stdout).to.contain('sales_channel')
      expect(ctx.stdout).to.contain('Access token info')
    })

  test
    .do(() => {
      auth()
        .post('/oauth/token', (body) => body.grant_type === 'password' && body.username === 'jane@example.com' && body.password === 'secret')
        .reply(200, tokenResponse(token({ application: { kind: 'sales_channel' }, owner: { id: 'cust1', type: 'Customer' } })))
    })
    .stdout()
    .command(['token:get', '-o', ORG, '-i', CLIENT_ID, '-S', 'market:code:EU', '-e', 'jane@example.com', '-p', 'secret'])
    .it('gets a customer token with the password flow', (ctx) => {
      expect(ctx.stdout).to.contain('Access token for sales_channel application')
    })

  test
    .do(() => {
      auth()
        .post('/oauth/token')
        .reply(401, { errors: [{ title: 'Unauthorized', detail: 'The client credentials are invalid', code: 'UNAUTHORIZED', status: '401' }] })
    })
    .command(['token:get', '-o', ORG, '-i', CLIENT_ID, '-s', 'wrong'])
    .catch(/client credentials are invalid|Unable to get access token/)
    .it('reports invalid credentials')

  test
    .command(['token:get', '-o', ORG, '-i', CLIENT_ID])
    .catch(/You must provide one of the arguments clientSecret and scope/)
    .it('requires a secret or a scope')

  test
    .command(['token:get', '-o', ORG, '-i', CLIENT_ID, '-S', 'market'])
    .catch(/Invalid scope: market/)
    .it('rejects an invalid scope')

  test
    .command(['token:get', '-o', ORG, '-i', CLIENT_ID, '-S', 'provisioning-api', '-S', 'market:code:EU'])
    .catch(/cannot be used together with other scopes/)
    .it('rejects provisioning-api mixed with other scopes')
})
