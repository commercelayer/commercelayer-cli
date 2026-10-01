import { describeLive, liveAuth, liveCreate, liveDelete, liveFirst, liveName } from '@commercelayer/cli-test-utils'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'

// A draft order of this run: the trigger only recomputes it
describeLive('triggers: trigger on a draft order', () => {
  let order: string | undefined

  before(async function () {
    const market = await liveFirst('markets')
    if (!market) this.skip()
    order = await liveCreate('orders', { reference: liveName('trigger') }, { market: { type: 'markets', id: market as string } })
  })
  after(() => liveDelete('orders', order))

  it('executes a trigger on the order', async () => {
    const ctx = await runCommand(['order:refresh', order as string, ...(await liveAuth()), '-p', '-j'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain(order as string)
  })
})
