import { expect, test } from '@oclif/test'
import { AUTH, api, notFound, useMockedApi } from '../../helpers'

describe('resources:delete', () => {
  useMockedApi()

  test
    .do(() => {
      api().delete('/api/customers/cUs1').reply(204)
    })
    .stdout()
    .command(['resources:delete', 'customers', 'cUs1', ...AUTH])
    .it('deletes the resource', (ctx) => {
      expect(ctx.stdout).to.contain('deleted resource of type customers with id cUs1')
    })

  test
    .do(() => {
      api().delete('/api/customers/cUs1').reply(204).delete('/api/customers/cUs2').reply(204)
    })
    .stdout()
    .command(['resources:delete', 'customers', 'cUs1,cUs2', ...AUTH])
    .it('deletes several resources at once', (ctx) => {
      expect(ctx.stdout).to.contain('All 2 customers have been successfully deleted')
    })

  test
    .do(() => {
      api().delete('/api/customers/nope').reply(404, notFound())
    })
    .stdout()
    .command(['resources:delete', 'customers', 'nope', ...AUTH])
    .catch(/not found|nope/i)
    .it('reports a missing resource', (ctx) => {
      expect(ctx.stdout).not.to.contain('Successfully')
    })
})
