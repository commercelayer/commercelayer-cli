import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, notFound, useMockedApi } from '../../helpers'

describe('resources:delete', () => {
  useMockedApi()

  it('deletes the resource', async () => {
    api().delete('/api/customers/cUs1').reply(204)
    const ctx = await runCommand(['resources:delete', 'customers', 'cUs1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('deleted resource of type customers with id cUs1')
  })

  it('deletes several resources at once', async () => {
    api().delete('/api/customers/cUs1').reply(204).delete('/api/customers/cUs2').reply(204)
    const ctx = await runCommand(['resources:delete', 'customers', 'cUs1,cUs2', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('All 2 customers have been successfully deleted')
  })

  it('reports a missing resource', async () => {
    api().delete('/api/customers/nope').reply(404, notFound())
    const ctx = await runCommand(['resources:delete', 'customers', 'nope', ...AUTH])
    expect(ctx.error?.message).to.match(/not found|nope/i)
    expect(ctx.stdout).not.to.contain('Successfully')
  })
})
