import { describeLive, liveAuth, liveFirst } from '@commercelayer/cli-test-utils'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'

const run = async (args: string[]): Promise<string> => {
  const ctx = await runCommand([...args, ...(await liveAuth())])
  if (ctx.error) throw ctx.error
  return ctx.stdout
}

describeLive('cleanups', () => {
  let id: string | undefined
  before(async () => {
    id = await liveFirst('cleanups')
  })

  it('lists the cleanups', async () => {
    expect(await run(['cleanups:list', '-l', '5'])).to.match(/Resource type|No cleanups found/)
    expect(await run(['cleanups', '-l', '5'])).to.match(/Resource type|No cleanups found/)
  })

  it('shows the details of a cleanup', async function () {
    if (!id) this.skip()
    expect(await run(['cleanups:details', id as string])).to.contain(id as string)
  })
})
