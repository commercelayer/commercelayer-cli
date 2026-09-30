import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, apiError, cleanup, list, useMockedApi } from '../../helpers'

describe('cleanups:list', () => {
  useMockedApi()

  it('lists the cleanups, most recent first', async () => {
    api()
      .get('/api/cleanups')
      .query((q) => q.sort === '-started_at')
      .reply(200, list([cleanup('cLn1'), cleanup('cLn2', { resource_type: 'orders', status: 'in_progress' })]))
    const ctx = await runCommand(['cleanups:list', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('cLn1')
    expect(ctx.stdout).to.contain('orders')
  })

  it('filters by type and status', async () => {
    api()
      .get('/api/cleanups')
      .query((q) => q['filter[q][resource_type_eq]'] === 'skus' && q['filter[q][status_eq]'] === 'completed')
      .reply(200, list([cleanup('cLn1')]))
    const ctx = await runCommand(['cleanups:list', ...AUTH, '-t', 'skus', '-s', 'completed'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('cLn1')
  })

  it('says when there are no cleanups', async () => {
    api().get('/api/cleanups').query(true).reply(200, list([]))
    const ctx = await runCommand(['cleanups:list', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.match(/No cleanups found/i)
  })

  it('rejects a non-positive limit', async () => {
    const ctx = await runCommand(['cleanups:list', ...AUTH, '-l', '0'])
    expect(ctx.error?.message).to.match(/Limit must be a positive integer/)
  })

  it('rejects an unknown type', async () => {
    const ctx = await runCommand(['cleanups:list', ...AUTH, '-t', 'unicorns'])
    expect(ctx.error?.message).to.match(/Expected --type=unicorns to be one of/)
  })

  it('reports an invalid access token', async () => {
    api().get('/api/cleanups').query(true).reply(401, apiError(401, 'Invalid token'))
    const ctx = await runCommand(['cleanups:list', ...AUTH])
    expect(ctx.error?.message).to.match(/Invalid token/)
  })
})
