import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, list, resource, useMockedApi } from '../../helpers'

describe('resources:count', () => {
  useMockedApi()

  it('counts the resources matching the filters', async () => {
    api()
      .get('/api/orders')
      .query((q) => q['filter[q][status_eq]'] === 'placed')
      .reply(200, { ...list([resource('orders', 'oRd1')]), meta: { record_count: 1234, page_count: 124 } })
    const ctx = await runCommand(['resources:count', 'orders', ...AUTH, '-w', 'status_eq=placed'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout + ctx.stderr).to.contain('1,234')
  })

  it('marks a count above 10,000 as estimated', async () => {
    api()
      .get('/api/skus')
      .query(true)
      .reply(200, { ...list([resource('skus', 'sKu1')]), meta: { record_count: 16_998, page_count: 1700 } })
    const ctx = await runCommand(['resources:count', 'skus', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout + ctx.stderr).to.contain('≈16,998').and.to.contain('estimated above 10,000')
  })

  it('reports zero as a count, not as an error', async () => {
    api().get('/api/orders').query(true).reply(200, list([]))
    const ctx = await runCommand(['resources:count', 'orders', ...AUTH, '-w', 'status_eq=unicorn'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout + ctx.stderr).to.match(/\b0\b/)
    expect(ctx.stdout + ctx.stderr).not.to.contain('Error counting')
  })
})
