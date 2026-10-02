import { describeLive, jsonOutput, liveAuth, liveFirst } from '@commercelayer/cli-test-utils'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'

let lastStdout = ''

/** stdout of a command run with --json, parsed */
const json = async (args: string[]): Promise<any> => {
  const ctx = await runCommand([...args, ...(await liveAuth()), '-j'])
  if (ctx.error) throw ctx.error
  lastStdout = ctx.stdout
  return jsonOutput(ctx.stdout)
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
    // ≈ marks the counts the API estimates above 10,000 records
    if (skus.length) expect(lastStdout).to.match(/Records: \d+ of ≈?[\d,.]+ \| Page: 1 of ≈?[\d,.]+/)
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
    // The SKU may have no prices: the command says so instead of printing an empty list
    const ctx = await runCommand(['resources:fetch', `skus/${skuId}/prices`, ...(await liveAuth()), '-j'])
    if (ctx.error) throw ctx.error
    if (/Relationship skus\.prices is empty/.test(ctx.stdout)) return
    expect(jsonOutput(ctx.stdout)).to.be.an('array')
  })

  it('counts the resources', async () => {
    const ctx = await runCommand(['resources:count', 'skus', ...(await liveAuth())])
    if (ctx.error) throw ctx.error
    // the count closes the Counting… spinner, on stderr
    expect(ctx.stdout + ctx.stderr).to.match(/\d/)
  })
})
