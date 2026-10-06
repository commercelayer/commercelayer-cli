import { expect, test } from '@oclif/test'
import { AUTH, api, list, resource, useMockedApi } from '../../helpers'

describe('resources:count', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .get('/api/orders')
        .query((q) => q['filter[q][status_eq]'] === 'placed')
        .reply(200, { ...list([resource('orders', 'oRd1')]), meta: { record_count: 1234, page_count: 124 } })
    })
    .stdout()
    .stderr()
    .command(['resources:count', 'orders', ...AUTH, '-w', 'status_eq=placed'])
    .it('counts the resources matching the filters', (ctx) => {
      expect(ctx.stdout + ctx.stderr).to.contain('1,234')
    })

  test
    .do(() => {
      api()
        .get('/api/skus')
        .query(true)
        .reply(200, { ...list([resource('skus', 'sKu1')]), meta: { record_count: 16_998, page_count: 1700 } })
    })
    .stdout()
    .stderr()
    .command(['resources:count', 'skus', ...AUTH])
    .it('marks a count above 10,000 as estimated', (ctx) => {
      expect(ctx.stdout + ctx.stderr).to.contain('≈16,998').and.to.contain('estimated above 10,000')
    })

  test
    .do(() => {
      api().get('/api/orders').query(true).reply(200, list([]))
    })
    .stdout()
    .stderr()
    .command(['resources:count', 'orders', ...AUTH, '-w', 'status_eq=unicorn'])
    .it('reports zero as a count, not as an error', (ctx) => {
      expect(ctx.stdout + ctx.stderr).to.match(/\b0\b/)
      expect(ctx.stdout + ctx.stderr).not.to.contain('Error counting')
    })
})
