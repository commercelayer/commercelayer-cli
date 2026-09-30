import { expect, test } from '@oclif/test'
import { AUTH, api, importJob, notFound, single, useMockedApi } from '../../helpers'

describe('imports:details', () => {
  useMockedApi()

  test
    .do(() => {
      api().get('/api/imports/iMp1').reply(200, single(importJob('iMp1')))
    })
    .stdout()
    .command(['imports:details', 'iMp1', ...AUTH])
    .it('shows the import attributes', (ctx) => {
      expect(ctx.stdout).to.contain('iMp1')
      expect(ctx.stdout).to.contain('skus')
      expect(ctx.stdout).not.to.contain('INPUTS')
    })

  test
    .do(() => {
      api()
        .get('/api/imports/iMp1')
        .reply(200, single(importJob('iMp1', { inputs: [{ code: 'TSHIRT-M' }, { code: 'TSHIRT-L' }] })))
    })
    .stdout()
    .command(['imports:details', 'iMp1', ...AUTH, '-i'])
    .it('shows the inputs', (ctx) => {
      expect(ctx.stdout).to.contain('INPUTS')
      expect(ctx.stdout).to.contain('2 records')
      expect(ctx.stdout).to.contain('TSHIRT-L')
    })

  test
    .do(() => {
      api()
        .get('/api/imports/iMp1')
        .reply(200, single(importJob('iMp1', { warnings_count: 1, warnings_log: { '1': ['code has already been taken'] }, errors_log: {} })))
    })
    .stdout()
    .command(['imports:details', 'iMp1', ...AUTH, '-l'])
    .it('shows the warning and error logs', (ctx) => {
      expect(ctx.stdout).to.contain('WARNING LOG')
      expect(ctx.stdout).to.contain('1 warning')
      expect(ctx.stdout).to.contain('has already been taken')
    })

  test
    .do(() => {
      api().get('/api/imports/nope').reply(404, notFound())
    })
    .command(['imports:details', 'nope', ...AUTH])
    .catch(/nope|not found/i)
    .it('reports a missing import')
})
