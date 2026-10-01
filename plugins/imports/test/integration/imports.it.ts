import { describeLive, liveAuth, liveFirst } from '@commercelayer/cli-test-utils'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'

const run = async (args: string[]): Promise<string> => {
  const ctx = await runCommand([...args, ...(await liveAuth())])
  if (ctx.error) throw ctx.error
  return ctx.stdout
}

describeLive('imports', () => {
  let id: string | undefined
  before(async () => {
    id = await liveFirst('imports')
  })

  it('lists the imports', async () => {
    expect(await run(['importsist', '-l', '5'])).to.match(/Resource type|No imports found/)
    expect(await run(['imports', '-l', '5'])).to.match(/Resource type|No imports found/)
  })

  it('shows the details of an import', async function () {
    if (!id) this.skip()
    expect(await run(['imports:details', id as string])).to.contain(id as string)
  })
})
