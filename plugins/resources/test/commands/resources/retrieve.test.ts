import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, notFound, resource, single, useMockedApi } from '../../helpers'

describe('resources:retrieve', () => {
  useMockedApi()

  const customer = single(resource('customers', 'cUs1', { email: 'jane@example.com' }))

  it('retrieves a resource by type and ID', async () => {
    api().get('/api/customers/cUs1').reply(200, customer)
    const ctx = await runCommand(['resources:retrieve', 'customers', 'cUs1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('jane@example.com')
  })

  it('accepts type/ID and prints JSON', async () => {
    api().get('/api/customers/cUs1').reply(200, customer)
    const ctx = await runCommand(['resources:retrieve', 'customers/cUs1', ...AUTH, '-j', '-u'])
    if (ctx.error) throw ctx.error
    expect(JSON.parse(ctx.stdout.substring(ctx.stdout.indexOf('{'), ctx.stdout.lastIndexOf('}') + 1)).email).to.equal('jane@example.com')
  })

  it('rejects an ID given twice', async () => {
    const ctx = await runCommand(['resources:retrieve', 'customers/cUs1', 'cUs2', ...AUTH])
    expect(ctx.error?.message).to.match(/Double definition of resource id/)
  })

  it('reports a missing resource', async () => {
    api().get('/api/customers/nope').reply(404, notFound())
    const ctx = await runCommand(['resources:retrieve', 'customers', 'nope', ...AUTH])
    expect(ctx.error?.message).to.match(/not found|nope/i)
  })
})
