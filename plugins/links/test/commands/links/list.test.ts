import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, apiError, link, list, resource, useMockedApi } from '../../helpers'

describe('links:list', () => {
  useMockedApi()

  it('lists the links, by expiration date', async () => {
    api()
      .get('/api/links')
      .query((q) => q.sort === '-expires_at,-starts_at' && q.include === 'item')
      .reply(200, list([link('lnK1'), link('lnK2', { name: 'Winter link' })], [resource('skus', 'skuId', { code: 'TSHIRT-M' })]))
    const ctx = await runCommand(['links:list', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('lnK1')
    expect(ctx.stdout).to.contain('Winter link')
  })

  it('filters by name and scope', async () => {
    api()
      .get('/api/links')
      .query((q) => q['filter[q][name_cont]'] === 'Summer' && q['filter[q][scope_cont]'] === 'market')
      .reply(200, list([link('lnK1')]))
    const ctx = await runCommand(['links:list', ...AUTH, '-n', 'Summer', '-S', 'market'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('lnK1')
  })

  it('says when there are no links', async () => {
    api().get('/api/links').query(true).reply(200, list([]))
    const ctx = await runCommand(['links:list', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('No links found')
  })

  it('rejects a non-positive limit', async () => {
    const ctx = await runCommand(['links:list', ...AUTH, '-l', '0'])
    expect(ctx.error?.message).to.match(/Limit must be a positive integer/)
  })

  it('reports an invalid access token', async () => {
    api().get('/api/links').query(true).reply(401, apiError(401, 'Invalid token', 'The access token you provided is invalid.'))
    const ctx = await runCommand(['links:list', ...AUTH])
    expect(ctx.error?.message).to.match(/Invalid token/)
  })
})
