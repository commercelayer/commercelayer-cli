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

  it('adds only the Buy All option', async () => {
    await skuList()
    const ctx = await runCommand(['microstore', ...AUTH, '-S', 'sKl1', '--all'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain(`${BASE}&all=true\n`)
  })

  it('adds the Cart option without the inline one', async () => {
    await skuList()
    const ctx = await runCommand(['microstore', ...AUTH, '-S', 'sKl1', '--cart'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain(`${BASE}&cart=true\n`)
  })

  it('adds the Cart and inline options without Buy All', async () => {
    await skuList()
    const ctx = await runCommand(['microstore', ...AUTH, '-S', 'sKl1', '--cart', '--inline'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain(`${BASE}&cart=true&inline=true`)
    expect(ctx.stdout).not.to.contain('all=true')
  })

  it('builds the URL on a custom domain', async () => {
    api(`https://${ORG}.example.com`).get('/api/sku_lists/sKl1').reply(200, single(resource('sku_lists', 'sKl1')))
    const ctx = await runCommand(['microstore', ...AUTH, '-S', 'sKl1', '-d', 'example.com'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain(`https://${ORG}.example.com/microstore/list/sKl1?accessToken=${TOKEN}`)
  })

  it('builds a staging URL on a custom domain', async () => {
    api(`https://${ORG}.example.com`).get('/api/sku_lists/sKl1').reply(200, single(resource('sku_lists', 'sKl1')))
    const ctx = await runCommand(['microstore', ...AUTH, '-S', 'sKl1', '-d', 'example.com', '--staging'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain(`https://${ORG}.stg.example.com/microstore/list/sKl1`)
  })

  it('rejects a token of another organization', async () => {
    const ctx = await runCommand(['microstore', '-o', ORG, '-a', token('sales_channel', 'other-org'), '-S', 'sKl1'])
    expect(ctx.error?.message).to.match(/belongs to a wrong organization: other-org/)
  })

  it('rejects a malformed access token', async () => {
    const ctx = await runCommand(['microstore', '-o', ORG, '-a', 'not-a-jwt', '-S', 'sKl1'])
    expect(ctx.error?.message).to.match(/Error decoding access token/)
  })

  it('suggests to log in again when the token is rejected', async () => {
    api().get('/api/sku_lists/sKl1').reply(401, apiError(401, 'Invalid token', 'The access token you provided is invalid'))
    const ctx = await runCommand(['microstore', ...AUTH, '-S', 'sKl1'])
    expect(ctx.error?.message).to.match(/Invalid token: {2}The access token you provided is invalid/)
    expect((ctx.error as { suggestions?: string[] } | undefined)?.suggestions?.join()).to.match(/Execute login/)
  })

  it('requires the SKU list id', async () => {
    const ctx = await runCommand(['microstore', ...AUTH])
    expect(ctx.error?.message).to.match(/Missing required flag skuListId/)
  })

  it('requires an access token', async () => {
    const ctx = await runCommand(['microstore', '-o', ORG, '-S', 'sKl1'])
    expect(ctx.error?.message).to.match(/Missing required flag accessToken/)
  })
})
