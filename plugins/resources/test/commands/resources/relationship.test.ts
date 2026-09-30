import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, list, resource, useMockedApi } from '../../helpers'

describe('resources:relationship', () => {
  useMockedApi()

  it('lists a 1-N relationship with filters', async () => {
    api()
      .get('/api/customers/cUs1/orders')
      .query((q) => q['filter[q][status_eq]'] === 'placed')
      .reply(200, list([resource('orders', 'oRd1', { number: '1234', status: 'placed' })]))
    const ctx = await runCommand(['resources:relationship', 'customers', 'cUs1', 'orders', ...AUTH, '-w', 'status_eq=placed'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('oRd1')
  })
})
