import { stripVTControlCharacters } from 'node:util'
import { describeLive, LIVE, LIVE_ORG, LIVE_RUN, LIVE_SALES_CHANNEL, liveDelete, liveRequest, liveSalesChannelToken } from '@commercelayer/cli-test-utils'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'

/** A market and the code of an SKU with a price in its price list */
const orderableSku = async (): Promise<{ market: string; code: string } | undefined> => {
  const markets = (await liveRequest('GET', '/api/markets?page[size]=10&include=price_list')).data
  for (const market of markets) {
    const priceList = market.relationships?.price_list?.data?.id
    if (!priceList) continue
    const prices = await liveRequest('GET', `/api/prices?filter[q][price_list_id_eq]=${priceList}&page[size]=1&include=sku&fields[skus]=code`)
    const code = prices.included?.find((r: { type: string }) => r.type === 'skus')?.attributes?.code
    if (code) return { market: market.id, code }
  }
  return undefined
}

// checkout creates a draft order of this run (deleted afterwards). It needs
// a sales channel access token.
describeLive(
  'checkout: create an order and its checkout URL',
  () => {
    let order: string | undefined
    after(() => liveDelete('orders', order))

    it('creates the order with a line item and prints the checkout URL', async function () {
      const target = await orderableSku()
      if (!target) this.skip()
      const { market, code } = target as { market: string; code: string }
      const token = await liveSalesChannelToken(market)
      const ctx = await runCommand(['checkout', '-o', LIVE_ORG, '-a', token, '-S', code, '-e', `${LIVE_RUN}@example.com`])
      const out = stripVTControlCharacters(ctx.stdout)
      order = out.match(/Created order (\w+)/)?.[1]
      if (ctx.error) throw ctx.error
      expect(order).to.be.a('string')
      expect(out).to.contain(`Checkout URL for order ${order}`)
      expect(out).to.match(new RegExp(`https://\\S+${order}`))
    })
  },
  LIVE && Boolean(LIVE_SALES_CHANNEL),
)
