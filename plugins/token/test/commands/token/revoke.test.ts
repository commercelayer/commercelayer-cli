import { expect, test } from '@oclif/test'
import { auth, CLIENT_ID, CLIENT_SECRET, ORG, token, useMockedApi } from '../../helpers'

describe('token:revoke', () => {
  useMockedApi()

  const accessToken = token()

  test
    .do(() => {
      auth()
        .post('/oauth/revoke', (body) => body.token === accessToken && body.client_id === CLIENT_ID && body.client_secret === CLIENT_SECRET)
        .reply(200, {})
    })
    .stdout()
    .stderr()
    .command(['token:revoke', accessToken, '-o', ORG, '-i', CLIENT_ID, '-s', CLIENT_SECRET])
    .it('revokes the token', (ctx) => {
      expect(ctx.stdout).to.contain('The access token has been successfully revoked')
    })

  test
    .do(() => {
      auth()
        .post('/oauth/revoke')
        .reply(401, { errors: [{ title: 'Unauthorized', detail: 'Invalid client', code: 'UNAUTHORIZED', status: '401' }] })
    })
    .stdout()
    .stderr()
    .command(['token:revoke', accessToken, '-o', ORG, '-i', CLIENT_ID, '-s', 'wrong'])
    .catch(/Invalid client/)
    .it('reports a failed revocation')

  test
    .command(['token:revoke', accessToken, '-o', ORG, '-i', CLIENT_ID])
    .catch(/You must provide one of the arguments clientSecret and scope/)
    .it('requires a secret or a scope')
})
