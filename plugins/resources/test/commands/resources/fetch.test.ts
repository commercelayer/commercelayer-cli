import { expect, test } from '@oclif/test'
import { AUTH, api, list, resource, useMockedApi } from '../../helpers'

describe('resources:fetch', () => {
  useMockedApi()

  test
    .do(() => {
      api().get('/api/customers').query(true).reply(200, list([resource('customers', 'cUs1', { email: 'jane@example.com' })]))
    })
    .stdout()
    .command(['resources:fetch', 'customers', ...AUTH])
    .it('fetches a resource list', (ctx) => {
      expect(ctx.stdout).to.contain('jane@example.com')
    })

  test
    .do(() => {
      api().get('/api/customers/cUs1/orders').query(true).reply(200, list([resource('orders', 'oRd1', { number: '1234' })]))
    })
    .stdout()
    .command(['resources:fetch', 'customers/cUs1/orders', ...AUTH])
    .it('fetches a relationship from a path', (ctx) => {
      expect(ctx.stdout).to.contain('oRd1')
    })
})
