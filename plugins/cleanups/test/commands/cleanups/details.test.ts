import { expect, test } from '@oclif/test'
import { AUTH, api, cleanup, notFound, single, useMockedApi } from '../../helpers'

describe('cleanups:details', () => {
  useMockedApi()

  test
    .do(() => {
      api().get('/api/cleanups/cLn1').reply(200, single(cleanup('cLn1')))
    })
    .stdout()
    .command(['cleanups:details', 'cLn1', ...AUTH])
    .it('shows the cleanup attributes', (ctx) => {
      expect(ctx.stdout).to.contain('cLn1')
      expect(ctx.stdout).to.contain('skus')
      expect(ctx.stdout).to.contain('code_start')
      expect(ctx.stdout).not.to.contain('ERROR LOG')
    })

  test
    .do(() => {
      api()
        .get('/api/cleanups/cLn1')
        .reply(200, single(cleanup('cLn1', { errors_count: 1, errors_log: { VALIDATION_ERROR: { message: 'sku OLD-1 is in use' } } })))
    })
    .stdout()
    .command(['cleanups:details', 'cLn1', ...AUTH, '-l'])
    .it('shows the error log', (ctx) => {
      expect(ctx.stdout).to.contain('ERROR LOG')
      expect(ctx.stdout).to.contain('1 error')
      expect(ctx.stdout).to.contain('is in use')
    })

  test
    .do(() => {
      api().get('/api/cleanups/nope').reply(404, notFound())
    })
    .command(['cleanups:details', 'nope', ...AUTH])
    .catch(/nope|not found/i)
    .it('reports a missing cleanup')
})
