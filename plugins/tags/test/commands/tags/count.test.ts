import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, list, resource, single, tag, useMockedApi } from '../../helpers'

describe('tags:count', () => {
  useMockedApi()

  it('counts the resources of one type with the tag', async () => {
    api()
      .get('/api/tags/aBcDeF')
      .reply(200, single(tag('aBcDeF', 'vip')))
      .get('/api/customers')
      .query((q) => q['filter[q][tags_id_eq]'] === 'aBcDeF')
      .reply(200, { ...list([resource('customers', 'cust1')]), meta: { record_count: 3, page_count: 3 } })
    const ctx = await runCommand(['tags:count', 'aBcDeF', ...AUTH, '-t', 'customers'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Tag name: vip')
    expect(ctx.stdout).to.match(/customers\s*│\s*3/)
  })

  it('rejects an unknown resource type', async () => {
    const ctx = await runCommand(['tags:count', 'aBcDeF', ...AUTH, '-t', 'unicorns'])
    expect(ctx.error?.message).to.match(/Invalid resource type: unicorns/)
  })
})
