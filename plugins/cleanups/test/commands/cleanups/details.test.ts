import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, cleanup, notFound, single, useMockedApi } from '../../helpers'

describe('cleanups:details', () => {
  useMockedApi()

  it('shows the cleanup attributes', async () => {
    api().get('/api/cleanups/cLn1').reply(200, single(cleanup('cLn1')))
    const ctx = await runCommand(['cleanups:details', 'cLn1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('cLn1')
    expect(ctx.stdout).to.contain('skus')
    expect(ctx.stdout).to.contain('code_start')
    expect(ctx.stdout).not.to.contain('ERROR LOG')
  })

  it('shows the error log', async () => {
    api()
      .get('/api/cleanups/cLn1')
      .reply(200, single(cleanup('cLn1', { errors_count: 1, errors_log: { VALIDATION_ERROR: { message: 'sku OLD-1 is in use' } } })))
    const ctx = await runCommand(['cleanups:details', 'cLn1', ...AUTH, '-l'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('ERROR LOG')
    expect(ctx.stdout).to.contain('1 error')
    expect(ctx.stdout).to.contain('is in use')
  })

  it('reports a missing cleanup', async () => {
    api().get('/api/cleanups/nope').reply(404, notFound())
    const ctx = await runCommand(['cleanups:details', 'nope', ...AUTH])
    expect(ctx.error?.message).to.match(/nope|not found/i)
  })
})
