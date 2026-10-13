import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { auth, CLIENT_ID, CLIENT_SECRET, ORG, token, useMockedApi } from '../../helpers'

describe('token:revoke', () => {
  useMockedApi()

  const accessToken = token()

  it('revokes the token', async () => {
    auth()
      .post('/oauth/revoke', (body) => body.token === accessToken && body.client_id === CLIENT_ID && body.client_secret === CLIENT_SECRET)
      .reply(200, {})
    const ctx = await runCommand(['token:revoke', accessToken, '-o', ORG, '-i', CLIENT_ID, '-s', CLIENT_SECRET])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('The access token has been successfully revoked')
  })

  it('reports a failed revocation', async () => {
    auth()
      .post('/oauth/revoke')
      .reply(401, { errors: [{ title: 'Unauthorized', detail: 'Invalid client', code: 'UNAUTHORIZED', status: '401' }] })
    const ctx = await runCommand(['token:revoke', accessToken, '-o', ORG, '-i', CLIENT_ID, '-s', 'wrong'])
    expect(ctx.error?.message).to.match(/Invalid client/)
  })

  it('requires a secret or a scope', async () => {
    const ctx = await runCommand(['token:revoke', accessToken, '-o', ORG, '-i', CLIENT_ID])
    expect(ctx.error?.message).to.match(/You must provide one of the arguments clientSecret and scope/)
  })
})
