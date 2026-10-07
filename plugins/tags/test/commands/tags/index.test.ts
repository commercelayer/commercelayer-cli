import { expect, test } from '@oclif/test'
import { AUTH, api, list, single, tag, useMockedApi } from '../../helpers'

describe('tags', () => {
  useMockedApi()

  test
    .do(() => {
      api().get('/api/tags').query(true).reply(200, list([tag('aBcDeF', 'vip')]))
    })
    .stdout()
    .command(['tags', ...AUTH])
    .it('lists the tags without an ID', (ctx) => {
      expect(ctx.stdout).to.contain('Total displayed tags: 1')
    })

  test
    .do(() => {
      api().get('/api/tags/aBcDeF').reply(200, single(tag('aBcDeF', 'vip')))
    })
    .stdout()
    .command(['tags', 'aBcDeF', ...AUTH])
    .it('shows the details with an ID', (ctx) => {
      expect(ctx.stdout).to.contain('created_at')
    })
})
