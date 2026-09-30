import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, apiError, link, resource, single, useMockedApi } from '../../helpers'

describe('links:details', () => {
  useMockedApi()

  it('shows the link attributes and its item', async () => {
    api()
      .get('/api/links/lnK1')
      .query((q) => q.include === 'item')
      .reply(200, single(link('lnK1'), [resource('skus', 'skuId', { code: 'TSHIRT-M' })]))
    const ctx = await runCommand(['links:details', 'lnK1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Summer link')
    expect(ctx.stdout).to.contain('https://test-org.c11r.link/lnK1')
    expect(ctx.stdout).to.contain('skuId')
  })

  it('says when the link does not exist', async () => {
    api().get('/api/links/nope').query(true).reply(404, apiError(404, 'Record not found'))
    const ctx = await runCommand(['links:details', 'nope', ...AUTH])
    expect(ctx.error?.oclif?.exit ?? 0).to.equal(0)
    expect(ctx.stdout).to.contain('Link nope not found')
  })

  it('reports other API errors instead of exiting silently', async () => {
    api().get('/api/links/lnK1').query(true).reply(401, apiError(401, 'Invalid token'))
    const ctx = await runCommand(['links:details', 'lnK1', ...AUTH])
    expect(ctx.error?.message).to.match(/Invalid token/)
  })
})
