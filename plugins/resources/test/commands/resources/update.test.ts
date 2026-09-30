import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, resource, single, useMockedApi } from '../../helpers'

describe('resources:update', () => {
  useMockedApi()

  it('updates the resource', async () => {
    api()
      .patch('/api/customers/cUs1', (body) => body.data.id === 'cUs1' && body.data.attributes.email === 'jane@example.org')
      .query(true)
      .reply(200, single(resource('customers', 'cUs1', { email: 'jane@example.org' })))
    const ctx = await runCommand(['resources:update', 'customers', 'cUs1', ...AUTH, '-a', 'email=jane@example.org'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('jane@example.org')
  })
})
