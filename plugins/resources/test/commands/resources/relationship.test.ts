import { expect, test } from '@oclif/test'
import { AUTH, api, list, resource, useMockedApi } from '../../helpers'

describe('resources:relationship', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .get('/api/customers/cUs1/orders')
        .query((q) => q['filter[q][status_eq]'] === 'placed')
        .reply(200, list([resource('orders', 'oRd1', { number: '1234', status: 'placed' })]))
    })
    .stdout()
    .command(['resources:relationship', 'customers', 'cUs1', 'orders', ...AUTH, '-w', 'status_eq=placed'])
    .it('lists a 1-N relationship with filters', (ctx) => {
      expect(ctx.stdout).to.contain('oRd1')
    })
})
