import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, list, resource, useMockedApi } from '../../helpers'

describe('resources:fetch', () => {
  useMockedApi()

  it('fetches a resource list', async () => {
    api().get('/api/customers').query(true).reply(200, list([resource('customers', 'cUs1', { email: 'jane@example.com' })]))
    const ctx = await runCommand(['resources:fetch', 'customers', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('jane@example.com')
  })

  it('fetches a relationship from a path', async () => {
    api().get('/api/customers/cUs1/orders').query(true).reply(200, list([resource('orders', 'oRd1', { number: '1234' })]))
    const ctx = await runCommand(['resources:fetch', 'customers/cUs1/orders', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('oRd1')
  })
})
