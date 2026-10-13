import { describeLive, liveAuth, liveFirst } from '@commercelayer/cli-test-utils'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'

const run = async (args: string[]): Promise<string> => {
  const ctx = await runCommand([...args, ...(await liveAuth())])
  if (ctx.error) throw ctx.error
  return ctx.stdout
}

describeLive('links', () => {
  let id: string | undefined
  before(async () => {
    id = await liveFirst('links')
  })

  it('lists the links', async () => {
    expect(await run(['links:list', '-l', '5'])).to.match(/Item type|No links found/)
  })

  it('shows the details of a link', async function () {
    if (!id) this.skip()
    expect(await run(['links:details', id as string])).to.contain(id as string)
  })
})
