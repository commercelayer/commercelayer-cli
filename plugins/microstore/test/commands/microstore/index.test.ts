import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, apiError, ORG, resource, single, TOKEN, token, useMockedApi } from '../../helpers'

describe('microstore', () => {
  useMockedApi()

  const BASE = `https://${ORG}.commercelayer.app/microstore/list/sKl1?accessToken=${TOKEN}`
  const skuList = () => api().get('/api/sku_lists/sKl1').reply(200, single(resource('sku_lists', 'sKl1', { name: 'Summer' })))

  it('prints the microstore URL of the SKU list', async () => {
    await skuList()
    const ctx = await runCommand(['microstore', ...AUTH, '-S', 'sKl1'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Microstore URL for sku list sKl1')
    expect(ctx.stdout).to.contain(BASE)
  })

  it('adds the Buy All, Cart and inline options', async () => {
    await skuList()
    const ctx = await runCommand(['microstore', ...AUTH, '-S', 'sKl1', '-A', '-C', '-I'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain(`${BASE}&all=true&cart=true&inline=true`)
  })

  it('builds a staging URL', async () => {
    await skuList()
    const ctx = await runCommand(['microstore', ...AUTH, '-S', 'sKl1', '--staging'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain(`https://${ORG}.stg.commercelayer.app/microstore/list/sKl1`)
  })

  it('requires the cart for the inline option', async () => {
    const ctx = await runCommand(['microstore', ...AUTH, '-S', 'sKl1', '-I'])
    expect(ctx.error?.message).to.match(/cart/)
  })

  it('reports a missing SKU list', async () => {
    api().get('/api/sku_lists/nope').reply(404, apiError(404, 'Record not found'))
    const ctx = await runCommand(['microstore', ...AUTH, '-S', 'nope'])
    expect(ctx.error?.message).to.match(/Record not found|not found/)
  })

  it('requires a sales channel token', async () => {
    const ctx = await runCommand(['microstore', '-o', ORG, '-a', token('integration'), '-S', 'sKl1'])
    expect(ctx.error?.message).to.match(/Invalid application kind: integration/)
  })
})
