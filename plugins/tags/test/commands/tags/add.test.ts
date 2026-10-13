import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, mockTagByName, resource, single, tag, useMockedApi } from '../../helpers'

describe('tags:add', () => {
  useMockedApi()

  const customer = (tags: string[]) =>
    single(resource('customers', 'cust1', { email: 'jane@example.com' }, { tags: { data: tags.map((id) => ({ type: 'tags', id })) } }), [])

  it('adds the tag to the resource', async () => {
    mockTagByName(api(), 'vip', tag('aBcDeF', 'vip'))
      .get('/api/customers/cust1')
      .query((q) => q.include === 'tags')
      .reply(200, customer([]))
      .patch('/api/customers/cust1', (body) => body.data.relationships.tags.data.map((t: { id: string }) => t.id).join() === 'aBcDeF')
      .reply(200, customer(['aBcDeF']))
    const ctx = await runCommand(['tags:add', ...AUTH, '-t', 'customers', '-n', 'vip', '-i', 'cust1'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('tagged with [vip] the customer with ID cust1')
  })

  it('stops when no tag exists', async () => {
    mockTagByName(api(), 'ghost')
    const ctx = await runCommand(['tags:add', ...AUTH, '-t', 'customers', '-n', 'ghost', '-i', 'cust1'])
    expect(ctx.error?.oclif?.exit ?? 0).to.equal(0)
    expect(ctx.stdout).to.contain('No new tags to add')
  })

  it('rejects an unknown resource type', async () => {
    const ctx = await runCommand(['tags:add', ...AUTH, '-t', 'unicorns', '-n', 'vip', '-i', 'x'])
    expect(ctx.error?.message).to.match(/Invalid resource type: unicorns/)
  })
})
