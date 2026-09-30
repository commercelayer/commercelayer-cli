import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, apiError, importJob, list, useMockedApi } from '../../helpers'

describe('imports:list', () => {
  useMockedApi()

  it('lists the imports, most recent first', async () => {
    api()
      .get('/api/imports')
      .query((q) => q.sort === '-started_at')
      .reply(200, list([importJob('iMp1'), importJob('iMp2', { resource_type: 'orders', status: 'in_progress' })]))
    const ctx = await runCommand(['imports:list', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('iMp1')
    expect(ctx.stdout).to.contain('orders')
  })

  it('filters by type and status', async () => {
    api()
      .get('/api/imports')
      .query((q) => q['filter[q][resource_type_eq]'] === 'skus' && q['filter[q][status_eq]'] === 'completed')
      .reply(200, list([importJob('iMp1')]))
    const ctx = await runCommand(['imports:list', ...AUTH, '-t', 'skus', '-s', 'completed'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('iMp1')
  })

  it('says when there are no imports', async () => {
    api().get('/api/imports').query(true).reply(200, list([]))
    const ctx = await runCommand(['imports:list', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.match(/No imports found/i)
  })

  it('rejects a non-positive limit', async () => {
    const ctx = await runCommand(['imports:list', ...AUTH, '-l', '0'])
    expect(ctx.error?.message).to.match(/Limit must be a positive integer/)
  })

  it('rejects an unknown type', async () => {
    const ctx = await runCommand(['imports:list', ...AUTH, '-t', 'unicorns'])
    expect(ctx.error?.message).to.match(/Expected --type=unicorns to be one of/)
  })

  it('reports an invalid access token', async () => {
    api().get('/api/imports').query(true).reply(401, apiError(401, 'Invalid token'))
    const ctx = await runCommand(['imports:list', ...AUTH])
    expect(ctx.error?.message).to.match(/Invalid token/)
  })
})
