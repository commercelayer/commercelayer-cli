import { expect, test } from '@oclif/test'
import { AUTH, api, notFound, resource, single, useMockedApi } from '../../helpers'

describe('resources:retrieve', () => {
  useMockedApi()

  const customer = single(resource('customers', 'cUs1', { email: 'jane@example.com' }))

  test
    .do(() => {
      api().get('/api/customers/cUs1').reply(200, customer)
    })
    .stdout()
    .command(['resources:retrieve', 'customers', 'cUs1', ...AUTH])
    .it('retrieves a resource by type and ID', (ctx) => {
      expect(ctx.stdout).to.contain('jane@example.com')
    })

  test
    .do(() => {
      api().get('/api/customers/cUs1').reply(200, customer)
    })
    .stdout()
    .command(['resources:retrieve', 'customers/cUs1', ...AUTH, '-j', '-u'])
    .it('accepts type/ID and prints JSON', (ctx) => {
      expect(JSON.parse(ctx.stdout.substring(ctx.stdout.indexOf('{'), ctx.stdout.lastIndexOf('}') + 1)).email).to.equal('jane@example.com')
    })

  test
    .command(['resources:retrieve', 'customers/cUs1', 'cUs2', ...AUTH])
    .catch(/Double definition of resource id/)
    .it('rejects an ID given twice')

  test
    .do(() => {
      api().get('/api/customers/nope').reply(404, notFound())
    })
    .command(['resources:retrieve', 'customers', 'nope', ...AUTH])
    .catch(/not found|nope/i)
    .it('reports a missing resource')
})
