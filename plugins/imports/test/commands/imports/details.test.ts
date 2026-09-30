import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, importJob, notFound, single, useMockedApi } from '../../helpers'

describe('imports:details', () => {
  useMockedApi()

  it('shows the import attributes', async () => {
    api().get('/api/imports/iMp1').reply(200, single(importJob('iMp1')))
    const ctx = await runCommand(['imports:details', 'iMp1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('iMp1')
    expect(ctx.stdout).to.contain('skus')
    expect(ctx.stdout).not.to.contain('INPUTS')
  })

  it('shows the inputs', async () => {
    api()
      .get('/api/imports/iMp1')
      .reply(200, single(importJob('iMp1', { inputs: [{ code: 'TSHIRT-M' }, { code: 'TSHIRT-L' }] })))
    const ctx = await runCommand(['imports:details', 'iMp1', ...AUTH, '-i'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('INPUTS')
    expect(ctx.stdout).to.contain('2 records')
    expect(ctx.stdout).to.contain('TSHIRT-L')
  })

  it('shows the warning and error logs', async () => {
    api()
      .get('/api/imports/iMp1')
      .reply(200, single(importJob('iMp1', { warnings_count: 1, warnings_log: { '1': ['code has already been taken'] }, errors_log: {} })))
    const ctx = await runCommand(['imports:details', 'iMp1', ...AUTH, '-l'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('WARNING LOG')
    expect(ctx.stdout).to.contain('1 warning')
    expect(ctx.stdout).to.contain('has already been taken')
  })

  it('reports a missing import', async () => {
    api().get('/api/imports/nope').reply(404, notFound())
    const ctx = await runCommand(['imports:details', 'nope', ...AUTH])
    expect(ctx.error?.message).to.match(/nope|not found/i)
  })
})
