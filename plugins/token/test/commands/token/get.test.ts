import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { auth, CLIENT_ID, CLIENT_SECRET, ORG, token, tokenResponse, useMockedApi } from '../../helpers'

describe('token:get', () => {
  useMockedApi()

  const accessToken = token()

  it('gets an access token with client credentials', async () => {
    auth()
      .post('/oauth/token', (body) => body.grant_type === 'client_credentials' && body.client_id === CLIENT_ID && body.client_secret === CLIENT_SECRET)
      .reply(200, tokenResponse(accessToken))
    const ctx = await runCommand(['token:get', '-o', ORG, '-i', CLIENT_ID, '-s', CLIENT_SECRET])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain(`Access token for integration application of organization ${ORG}`)
    expect(ctx.stdout).to.contain(accessToken)
  })

  it('gets a scoped sales channel token and shows its info', async () => {
    auth()
      .post('/oauth/token', (body) => body.grant_type === 'client_credentials' && body.scope === 'market:code:EU')
      .reply(200, tokenResponse(token({ application: { kind: 'sales_channel' } })))
    const ctx = await runCommand(['token:get', '-o', ORG, '-i', CLIENT_ID, '-S', 'market:code:EU', '--info'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('sales_channel')
    expect(ctx.stdout).to.contain('Access token info')
  })

  it('gets a customer token with the password flow', async () => {
    auth()
      .post('/oauth/token', (body) => body.grant_type === 'password' && body.username === 'jane@example.com' && body.password === 'secret')
      .reply(200, tokenResponse(token({ application: { kind: 'sales_channel' }, owner: { id: 'cust1', type: 'Customer' } })))
    const ctx = await runCommand(['token:get', '-o', ORG, '-i', CLIENT_ID, '-S', 'market:code:EU', '-e', 'jane@example.com', '-p', 'secret'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Access token for sales_channel application')
  })

  it('reports invalid credentials', async () => {
    auth()
      .post('/oauth/token')
      .reply(401, { errors: [{ title: 'Unauthorized', detail: 'The client credentials are invalid', code: 'UNAUTHORIZED', status: '401' }] })
    const ctx = await runCommand(['token:get', '-o', ORG, '-i', CLIENT_ID, '-s', 'wrong'])
    expect(ctx.error?.message).to.match(/client credentials are invalid|Unable to get access token/)
  })

  it('requires a secret or a scope', async () => {
    const ctx = await runCommand(['token:get', '-o', ORG, '-i', CLIENT_ID])
    expect(ctx.error?.message).to.match(/You must provide one of the arguments clientSecret and scope/)
  })

  it('rejects an invalid scope', async () => {
    const ctx = await runCommand(['token:get', '-o', ORG, '-i', CLIENT_ID, '-S', 'market'])
    expect(ctx.error?.message).to.match(/Invalid scope: market/)
  })

  it('rejects provisioning-api mixed with other scopes', async () => {
    const ctx = await runCommand(['token:get', '-o', ORG, '-i', CLIENT_ID, '-S', 'provisioning-api', '-S', 'market:code:EU'])
    expect(ctx.error?.message).to.match(/cannot be used together with other scopes/)
  })
})
