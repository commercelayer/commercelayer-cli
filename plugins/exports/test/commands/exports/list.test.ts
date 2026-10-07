import { expect, test } from '@oclif/test'
import { AUTH, api, apiError, exportJob, list, useMockedApi } from '../../helpers'

describe('exports:list', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .get('/api/exports')
        .query((q) => q.sort === '-started_at')
        .reply(200, list([exportJob('eXp1'), exportJob('eXp2', { resource_type: 'orders', status: 'in_progress' })]))
    })
    .stdout()
    .command(['exports:list', ...AUTH])
    .it('lists the exports, most recent first', (ctx) => {
      expect(ctx.stdout).to.contain('eXp1')
      expect(ctx.stdout).to.contain('orders')
    })

  test
    .do(() => {
      api()
        .get('/api/exports')
        .query((q) => q['filter[q][resource_type_eq]'] === 'skus' && q['filter[q][status_eq]'] === 'completed')
        .reply(200, list([exportJob('eXp1')]))
    })
    .stdout()
    .command(['exports:list', ...AUTH, '-t', 'skus', '-s', 'completed'])
    .it('filters by type and status', (ctx) => {
      expect(ctx.stdout).to.contain('eXp1')
    })

  test
    .do(() => {
      api().get('/api/exports').query(true).reply(200, list([]))
    })
    .stdout()
    .command(['exports:list', ...AUTH])
    .it('says when there are no exports', (ctx) => {
      expect(ctx.stdout).to.match(/No exports found/i)
    })

  test
    .command(['exports:list', ...AUTH, '-l', '0'])
    .catch(/Limit must be a positive integer/)
    .it('rejects a non-positive limit')

  test
    .command(['exports:list', ...AUTH, '-t', 'unicorns'])
    .catch(/Expected --type=unicorns to be one of/)
    .it('rejects an unknown type')

  test
    .do(() => {
      api().get('/api/exports').query(true).reply(401, apiError(401, 'Invalid token'))
    })
    .command(['exports:list', ...AUTH])
    .catch(/Invalid token/)
    .it('reports an invalid access token')
})
