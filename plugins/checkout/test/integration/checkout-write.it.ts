import { stripVTControlCharacters } from 'node:util'
import { describeLive, LIVE, LIVE_ORG, LIVE_RUN, LIVE_SALES_CHANNEL, liveDelete, liveRequest, liveSalesChannelToken } from '@commercelayer/cli-test-utils'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'

/**
 * A market and the code of an SKU with a price in its price list: from a
 * price, its price list, and a market using that price list
 */
const orderableSku = async (): Promise<{ market: string; code: string } | string> => {
  const prices = await liveRequest('GET', '/api/prices?page[size]=25&include=sku,price_list&fields[skus]=code')
  if (!prices.data.length) return 'no prices'
  for (const price of prices.data) {
    const priceList = price.relationships?.price_list?.data?.id
    const skuId = price.relationships?.sku?.data?.id
    const code = prices.included?.find((r: { type: string; id: string }) => r.type === 'skus' && r.id === skuId)?.attributes?.code
    if (!priceList || !code) continue
    const markets = await liveRequest('GET', `/api/markets?filter[q][price_list_id_eq]=${priceList}&page[size]=1`)
    if (markets.data[0]) return { market: markets.data[0].id, code }
  }
  return 'no market uses the price list of the first prices'
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
      if (typeof target === 'string') {
        console.log(`      skipped: ${target}`)
        this.skip()
      }
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
