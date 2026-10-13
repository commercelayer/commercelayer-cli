import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, apiError, useMockedApi } from '../../helpers'

describe('provisioning:delete', () => {
  useMockedApi()

  it('deletes the resource', async () => {
    api().delete('/api/api_credentials/aPc1').reply(204)
    const ctx = await runCommand(['provisioning:delete', 'api_credentials', 'aPc1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('deleted resource of type api_credentials with id aPc1')
  })

  it('reports a missing resource', async () => {
    api().delete('/api/api_credentials/nope').reply(404, apiError(404, 'Record not found'))
    const ctx = await runCommand(['provisioning:delete', 'api_credentials', 'nope', ...AUTH])
    expect(ctx.error?.message).to.match(/Record not found/)
    expect(ctx.stdout).not.to.contain('Successfully')
  })
})
