import { expect, test } from '@oclif/test'
import { AUTH, api, list, tag, useMockedApi } from '../../helpers'

describe('tags:list', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .get('/api/tags')
        .query((q) => q.sort === '-created_at' && q['page[number]'] === '1')
        .reply(200, list([tag('aBcDeF', 'vip'), tag('gHiJkL', 'wholesale')]))
    })
    .stdout()
    .command(['tags:list', ...AUTH])
    .it('lists the tags, newest first', (ctx) => {
      expect(ctx.stdout).to.contain('vip')
      expect(ctx.stdout).to.contain('wholesale')
      expect(ctx.stdout).to.contain('aBcDeF')
      expect(ctx.stdout).to.contain('Total displayed tags: 2')
    })

  test
    .do(() => {
      api().get('/api/tags').query(true).reply(200, list([]))
    })
    .stdout()
    .command(['tags:list', ...AUTH])
    .it('says when there are no tags', (ctx) => {
      expect(ctx.stdout).to.contain('No tags found')
    })

  test
    .do(() => {
      api()
        .get('/api/tags')
        .query((q) => q['page[size]'] === '5')
        .reply(200, list([tag('aBcDeF', 'vip')]))
    })
    .stdout()
    .command(['tags:list', ...AUTH, '-l', '5'])
    .it('uses the limit as page size', (ctx) => {
      expect(ctx.stdout).to.contain('vip')
    })

  test
    .command(['tags:list', ...AUTH, '-l', '0'])
    .catch(/Limit must be a positive integer/)
    .it('rejects a non-positive limit')

  test
    .do(() => {
      api()
        .get('/api/tags')
        .query(true)
        .reply(401, { errors: [{ title: 'Invalid token', detail: 'The access token you provided is invalid.', code: 'INVALID_TOKEN', status: '401' }] })
    })
    .command(['tags:list', ...AUTH])
    .catch(/Invalid token/)
    .it('reports an invalid access token')
})
