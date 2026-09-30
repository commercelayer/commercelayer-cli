import { expect, test } from '@oclif/test'
import { AUTH, api, resource, single, useMockedApi } from '../../helpers'

describe('resources:create', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .post('/api/customers', (body) => {
          const { attributes, relationships } = body.data
          return (
            attributes.email === 'jane@example.com' &&
            attributes.metadata.tier === 'gold' &&
            relationships.customer_group.data.type === 'customer_groups' &&
            relationships.customer_group.data.id === 'gRp1'
          )
        })
        .query(true)
        .reply(201, single(resource('customers', 'cUs9', { email: 'jane@example.com' })))
    })
    .stdout()
    .command(['resources:create', 'customers', ...AUTH, '-a', 'email=jane@example.com', '-r', 'customer_group=customer_groups/gRp1', '-m', 'tier=gold'])
    .it('creates the resource with attributes, relationships and metadata', (ctx) => {
      expect(ctx.stdout).to.contain('cUs9')
    })

  test
    .command(['resources:create', 'customers', ...AUTH, '-a', 'email'])
    .catch(/Invalid attribute email/)
    .it('rejects an attribute without a value')
})
