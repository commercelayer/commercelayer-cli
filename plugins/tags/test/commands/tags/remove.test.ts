import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, mockTagByName, resource, single, tag, useMockedApi } from '../../helpers'

describe('tags:remove', () => {
  useMockedApi()

  const customer = (tags: string[]) =>
    single(
      resource('customers', 'cust1', { email: 'jane@example.com' }, { tags: { data: tags.map((id) => ({ type: 'tags', id })) } }),
      tags.map((id) => tag(id, id === 'aBcDeF' ? 'vip' : 'other')),
    )

  it('removes the tag and keeps the others', async () => {
    mockTagByName(api(), 'vip', tag('aBcDeF', 'vip'))
      .get('/api/customers/cust1')
      .query((q) => q.include === 'tags')
      .reply(200, customer(['aBcDeF', 'zZzZzZ']))
      .patch('/api/customers/cust1', (body) => body.data.relationships.tags.data.map((t: { id: string }) => t.id).join() === 'zZzZzZ')
      .reply(200, customer(['zZzZzZ']))
    const ctx = await runCommand(['tags:remove', ...AUTH, '-t', 'customers', '-n', 'vip', '-i', 'cust1'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('removed tags [vip] from the customer with ID cust1')
  })

  it('leaves an untagged resource alone', async () => {
    mockTagByName(api(), 'vip', tag('aBcDeF', 'vip')).get('/api/customers/cust1').query(true).reply(200, customer([]))
    const ctx = await runCommand(['tags:remove', ...AUTH, '-t', 'customers', '-n', 'vip', '-i', 'cust1', '-v'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Customer with ID cust1 has no tags')
  })
})
