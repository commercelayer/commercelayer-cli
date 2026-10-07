import { expect, test } from '@oclif/test'
import { AUTH, api, resource, single, useMockedApi } from '../../helpers'

describe('resources:update', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .patch('/api/customers/cUs1', (body) => body.data.id === 'cUs1' && body.data.attributes.email === 'jane@example.org')
        .query(true)
        .reply(200, single(resource('customers', 'cUs1', { email: 'jane@example.org' })))
    })
    .stdout()
    .command(['resources:update', 'customers', 'cUs1', ...AUTH, '-a', 'email=jane@example.org'])
    .it('updates the resource', (ctx) => {
      expect(ctx.stdout).to.contain('jane@example.org')
    })
})
