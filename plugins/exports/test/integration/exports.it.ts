import { describeLive, liveAuth, liveFirst } from '@commercelayer/cli-test-utils'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'

const run = async (args: string[]): Promise<string> => {
  const ctx = await runCommand([...args, ...(await liveAuth())])
  if (ctx.error) throw ctx.error
  return ctx.stdout
}

describeLive('exports', () => {
  let id: string | undefined
  before(async () => {
    id = await liveFirst('exports')
  })

  it('lists the exports', async () => {
    expect(await run(['exportsist', '-l', '5'])).to.match(/Resource type|No exports found/)
    expect(await run(['exports', '-l', '5'])).to.match(/Resource type|No exports found/)
  })

  it('shows the details of an export', async function () {
    if (!id) this.skip()
    expect(await run(['exports:details', id as string])).to.contain(id as string)
  })
})
