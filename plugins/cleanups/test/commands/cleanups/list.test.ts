import { expect, test } from '@oclif/test'
import { AUTH, api, apiError, cleanup, list, useMockedApi } from '../../helpers'

describe('cleanups:list', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .get('/api/cleanups')
        .query((q) => q.sort === '-started_at')
        .reply(200, list([cleanup('cLn1'), cleanup('cLn2', { resource_type: 'orders', status: 'in_progress' })]))
    })
    .stdout()
    .command(['cleanups:list', ...AUTH])
    .it('lists the cleanups, most recent first', (ctx) => {
      expect(ctx.stdout).to.contain('cLn1')
      expect(ctx.stdout).to.contain('orders')
    })

  test
    .do(() => {
      api()
        .get('/api/cleanups')
        .query((q) => q['filter[q][resource_type_eq]'] === 'skus' && q['filter[q][status_eq]'] === 'completed')
        .reply(200, list([cleanup('cLn1')]))
    })
    .stdout()
    .command(['cleanups:list', ...AUTH, '-t', 'skus', '-s', 'completed'])
    .it('filters by type and status', (ctx) => {
      expect(ctx.stdout).to.contain('cLn1')
    })

  test
    .do(() => {
      api().get('/api/cleanups').query(true).reply(200, list([]))
    })
    .stdout()
    .command(['cleanups:list', ...AUTH])
    .it('says when there are no cleanups', (ctx) => {
      expect(ctx.stdout).to.match(/No cleanups found/i)
    })

  test
    .command(['cleanups:list', ...AUTH, '-l', '0'])
    .catch(/Limit must be a positive integer/)
    .it('rejects a non-positive limit')

  test
    .command(['cleanups:list', ...AUTH, '-t', 'unicorns'])
    .catch(/Expected --type=unicorns to be one of/)
    .it('rejects an unknown type')

  test
    .do(() => {
      api().get('/api/cleanups').query(true).reply(401, apiError(401, 'Invalid token'))
    })
    .command(['cleanups:list', ...AUTH])
    .catch(/Invalid token/)
    .it('reports an invalid access token')
})
