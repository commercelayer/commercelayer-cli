import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, resource, single, useMockedApi } from '../../helpers'

describe('resources:create', () => {
  useMockedApi()

  it('creates the resource with attributes, relationships and metadata', async () => {
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
    const ctx = await runCommand(['resources:create', 'customers', ...AUTH, '-a', 'email=jane@example.com', '-r', 'customer_group=customer_groups/gRp1', '-m', 'tier=gold'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('cUs9')
  })

  it('rejects an attribute without a value', async () => {
    const ctx = await runCommand(['resources:create', 'customers', ...AUTH, '-a', 'email'])
    expect(ctx.error?.message).to.match(/Invalid attribute email/)
  })
})
