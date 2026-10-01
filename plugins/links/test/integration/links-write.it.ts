import { describeLive, LIVE, LIVE_SALES_CHANNEL, liveAuth, liveDelete, liveFirst, liveName } from '@commercelayer/cli-test-utils'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'

const run = async (args: string[]): Promise<string> => {
  const ctx = await runCommand([...args, ...(await liveAuth())])
  if (ctx.error) throw ctx.error
  return ctx.stdout
}

const linkId = (name: string) => liveFirst('links', { 'filter[q][name_eq]': name })

// A link of this run to an existing SKU (the SKU is not changed). Links need
// the client ID of a sales channel application.
describeLive(
  'links: create, update, disable, enable and delete',
  () => {
    let id: string | undefined
    let sku: string | undefined
    let market: string | undefined

    before(async function () {
      sku = await liveFirst('skus')
      market = await liveFirst('markets')
      if (!sku || !market) this.skip()
    })
    after(() => liveDelete('links', id))

    it('creates a link', async () => {
      const starts = new Date().toISOString()
      const expires = new Date(Date.now() + 24 * 3600 * 1000).toISOString()
      const out = await run(['links:create', '-t', 'skus', '-i', sku as string, '-n', liveName('link'), '-I', LIVE_SALES_CHANNEL, '-S', `market:id:${market}`, '-s', starts, '-e', expires])
      expect(out).to.contain('created new link')
      id = await linkId(liveName('link'))
      expect(id).to.be.a('string')
    })

    it('updates the link', async () => {
      expect(await run(['links:update', id as string, '-n', liveName('link2')])).to.contain(id as string)
      expect(await linkId(liveName('link2'))).to.equal(id)
    })

    it('disables and enables the link', async () => {
      expect(await run(['links:disable', id as string])).to.contain('disabled link')
      expect(await run(['links:enable', id as string])).to.contain('enabled link')
    })

    it('deletes the link', async () => {
      expect(await run(['links:delete', id as string])).to.contain('deleted link')
      expect(await linkId(liveName('link2'))).to.equal(undefined)
      id = undefined
    })
  },
  LIVE && Boolean(LIVE_SALES_CHANNEL),
)
