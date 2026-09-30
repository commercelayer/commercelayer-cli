import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, list, resource, single, tag, useMockedApi } from '../../helpers'

describe('tags:which', () => {
  useMockedApi()

  it('lists the resources with the tag', async () => {
    api()
      .get('/api/tags/aBcDeF')
      .reply(200, single(tag('aBcDeF', 'vip')))
      .get('/api/customers')
      .query((q) => q['filter[q][tags_id_eq]'] === 'aBcDeF' && q.include === 'tags')
      .reply(200, list([resource('customers', 'cust1', { email: 'jane@example.com' }, { tags: { data: [{ type: 'tags', id: 'aBcDeF' }] } })], [tag('aBcDeF', 'vip')]))
    const ctx = await runCommand(['tags:which', 'aBcDeF', ...AUTH, '-t', 'customers'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('cust1')
    expect(ctx.stdout).to.contain('Total displayed customers: 1')
  })

  it('rejects a non-positive limit', async () => {
    const ctx = await runCommand(['tags:which', 'aBcDeF', ...AUTH, '-t', 'customers', '-l', '0'])
    expect(ctx.error?.message).to.match(/Limit must be a positive integer/)
  })
})
