import { expect, test } from '@oclif/test'
import { AUTH, api, mockTagByName, resource, single, tag, useMockedApi } from '../../helpers'

describe('tags:add', () => {
  useMockedApi()

  const customer = (tags: string[]) =>
    single(resource('customers', 'cust1', { email: 'jane@example.com' }, { tags: { data: tags.map((id) => ({ type: 'tags', id })) } }), [])

  test
    .do(() => {
      mockTagByName(api(), 'vip', tag('aBcDeF', 'vip'))
        .get('/api/customers/cust1')
        .query((q) => q.include === 'tags')
        .reply(200, customer([]))
        .patch('/api/customers/cust1', (body) => body.data.relationships.tags.data.map((t: { id: string }) => t.id).join() === 'aBcDeF')
        .reply(200, customer(['aBcDeF']))
    })
    .stdout()
    .command(['tags:add', ...AUTH, '-t', 'customers', '-n', 'vip', '-i', 'cust1'])
    .it('adds the tag to the resource', (ctx) => {
      expect(ctx.stdout).to.contain('tagged with [vip] the customer with ID cust1')
    })

  test
    .do(() => {
      mockTagByName(api(), 'ghost')
    })
    .stdout()
    .command(['tags:add', ...AUTH, '-t', 'customers', '-n', 'ghost', '-i', 'cust1'])
    .exit(0)
    .it('stops when no tag exists', (ctx) => {
      expect(ctx.stdout).to.contain('No new tags to add')
    })

  test
    .command(['tags:add', ...AUTH, '-t', 'unicorns', '-n', 'vip', '-i', 'x'])
    .catch(/Invalid resource type: unicorns/)
    .it('rejects an unknown resource type')
})
