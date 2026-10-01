import { describeLive, liveAuth, liveFirst } from '@commercelayer/cli-test-utils'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'

/** stdout of a command run with --json, parsed */
const json = async (args: string[]): Promise<any> => {
  const ctx = await runCommand([...args, ...(await liveAuth()), '-j'])
  if (ctx.error) throw ctx.error
  return JSON.parse(ctx.stdout)
}

describeLive('resources', () => {
  let skuId: string | undefined
  before(async () => {
    skuId = await liveFirst('skus')
  })

  it('lists a resource type', async () => {
    const skus = await json(['resources:list', 'skus', '-n', '5'])
    expect(skus).to.be.an('array').with.length.at.most(5)
    for (const sku of skus) expect(sku).to.include({ type: 'skus' }).and.to.have.property('code')
  })

  it('lists with filters, sort and fields', async () => {
    const markets = await json(['resources:list', 'markets', '-w', 'name_present=true', '-s', 'name', '-f', 'name'])
    expect(markets).to.be.an('array')
    const names = markets.map((m: { name: string }) => m.name)
    expect(names).to.deep.equal([...names].sort((a: string, b: string) => a.localeCompare(b, 'en', { sensitivity: 'base' })))
  })

  it('retrieves a resource, with an include', async function () {
    if (!skuId) this.skip()
    const sku = await json(['resources:retrieve', 'skus', skuId as string, '-i', 'shipping_category'])
    expect(sku).to.include({ id: skuId, type: 'skus' })
  })

  it('gets a list or a single resource', async function () {
    expect(await json(['resources:get', 'skus', '-n', '1'])).to.be.an('array')
    if (!skuId) this.skip()
    expect(await json(['resources:get', 'skus', skuId as string])).to.include({ id: skuId })
  })

  it('fetches a path and a relationship', async function () {
    if (!skuId) this.skip()
    expect(await json(['resources:fetch', `skus/${skuId}`])).to.include({ id: skuId })
    expect(await json(['resources:fetch', `skus/${skuId}/prices`])).to.be.an('array')
  })

  it('counts the resources', async () => {
    const ctx = await runCommand(['resources:count', 'skus', ...(await liveAuth())])
    if (ctx.error) throw ctx.error
    expect(ctx.stderr + ctx.stdout).to.match(/Counting skus/)
  })
})
