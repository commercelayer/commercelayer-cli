import { expect, test } from '@oclif/test'
import { AUTH, api, list, resource, single, tag, useMockedApi } from '../../helpers'

describe('tags:which', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .get('/api/tags/aBcDeF')
        .reply(200, single(tag('aBcDeF', 'vip')))
        .get('/api/customers')
        .query((q) => q['filter[q][tags_id_eq]'] === 'aBcDeF' && q.include === 'tags')
        .reply(200, list([resource('customers', 'cust1', { email: 'jane@example.com' }, { tags: { data: [{ type: 'tags', id: 'aBcDeF' }] } })], [tag('aBcDeF', 'vip')]))
    })
    .stdout()
    .command(['tags:which', 'aBcDeF', ...AUTH, '-t', 'customers'])
    .it('lists the resources with the tag', (ctx) => {
      expect(ctx.stdout).to.contain('cust1')
      expect(ctx.stdout).to.contain('Total displayed customers: 1')
    })

  test
    .command(['tags:which', 'aBcDeF', ...AUTH, '-t', 'customers', '-l', '0'])
    .catch(/Limit must be a positive integer/)
    .it('rejects a non-positive limit')
})
