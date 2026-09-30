import { expect, test } from '@oclif/test'
import { AUTH, api, apiError, importJob, list, useMockedApi } from '../../helpers'

describe('imports:list', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .get('/api/imports')
        .query((q) => q.sort === '-started_at')
        .reply(200, list([importJob('iMp1'), importJob('iMp2', { resource_type: 'orders', status: 'in_progress' })]))
    })
    .stdout()
    .command(['imports:list', ...AUTH])
    .it('lists the imports, most recent first', (ctx) => {
      expect(ctx.stdout).to.contain('iMp1')
      expect(ctx.stdout).to.contain('orders')
    })

  test
    .do(() => {
      api()
        .get('/api/imports')
        .query((q) => q['filter[q][resource_type_eq]'] === 'skus' && q['filter[q][status_eq]'] === 'completed')
        .reply(200, list([importJob('iMp1')]))
    })
    .stdout()
    .command(['imports:list', ...AUTH, '-t', 'skus', '-s', 'completed'])
    .it('filters by type and status', (ctx) => {
      expect(ctx.stdout).to.contain('iMp1')
    })

  test
    .do(() => {
      api().get('/api/imports').query(true).reply(200, list([]))
    })
    .stdout()
    .command(['imports:list', ...AUTH])
    .it('says when there are no imports', (ctx) => {
      expect(ctx.stdout).to.match(/No imports found/i)
    })

  test
    .command(['imports:list', ...AUTH, '-l', '0'])
    .catch(/Limit must be a positive integer/)
    .it('rejects a non-positive limit')

  test
    .command(['imports:list', ...AUTH, '-t', 'unicorns'])
    .catch(/Expected --type=unicorns to be one of/)
    .it('rejects an unknown type')

  test
    .do(() => {
      api().get('/api/imports').query(true).reply(401, apiError(401, 'Invalid token'))
    })
    .command(['imports:list', ...AUTH])
    .catch(/Invalid token/)
    .it('reports an invalid access token')
})
