import { expect, test } from '@oclif/test'
import { AUTH, api, list, resource, single, tag, useMockedApi } from '../../helpers'

describe('tags:count', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .get('/api/tags/aBcDeF')
        .reply(200, single(tag('aBcDeF', 'vip')))
        .get('/api/customers')
        .query((q) => q['filter[q][tags_id_eq]'] === 'aBcDeF')
        .reply(200, { ...list([resource('customers', 'cust1')]), meta: { record_count: 3, page_count: 3 } })
    })
    .stdout()
    .command(['tags:count', 'aBcDeF', ...AUTH, '-t', 'customers'])
    .it('counts the resources of one type with the tag', (ctx) => {
      expect(ctx.stdout).to.contain('Tag name: vip')
      expect(ctx.stdout).to.match(/customers\s*│\s*3/)
    })

  test
    .command(['tags:count', 'aBcDeF', ...AUTH, '-t', 'unicorns'])
    .catch(/Invalid resource type: unicorns/)
    .it('rejects an unknown resource type')
})
