import { describeLive, liveAuth, liveFirst } from '@commercelayer/cli-test-utils'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'

const run = async (args: string[]): Promise<string> => {
  const ctx = await runCommand([...args, ...(await liveAuth())])
  if (ctx.error) throw ctx.error
  return ctx.stdout
}

describeLive('webhooks', () => {
  let id: string | undefined
  before(async () => {
    id = await liveFirst('webhooks')
  })

  it('lists the webhooks', async () => {
    expect(await run(['webhooks:list'])).to.match(/Circuit state|No webhooks found/)
    expect(await run(['webhooks:list', '-c', 'closed'])).to.match(/Circuit state|No webhooks found/)
  })

  it('shows the details and the events of a webhook', async function () {
    if (!id) this.skip()
    expect(await run(['webhooks:details', id as string])).to.contain(id as string)
    expect(await run(['webhooks:events', id as string, '-l', '5'])).to.be.a('string')
  })
})
