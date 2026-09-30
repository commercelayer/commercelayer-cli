import { expect, test } from '@oclif/test'
import { AUTH, api, apiError, useMockedApi } from '../../helpers'

describe('provisioning:delete', () => {
  useMockedApi()

  test
    .do(() => {
      api().delete('/api/api_credentials/aPc1').reply(204)
    })
    .stdout()
    .command(['provisioning:delete', 'api_credentials', 'aPc1', ...AUTH])
    .it('deletes the resource', (ctx) => {
      expect(ctx.stdout).to.contain('deleted resource of type api_credentials with id aPc1')
    })

  test
    .do(() => {
      api().delete('/api/api_credentials/nope').reply(404, apiError(404, 'Record not found'))
    })
    .stdout()
    .command(['provisioning:delete', 'api_credentials', 'nope', ...AUTH])
    .catch(/Record not found/)
    .it('reports a missing resource', (ctx) => {
      expect(ctx.stdout).not.to.contain('Successfully')
    })
})
