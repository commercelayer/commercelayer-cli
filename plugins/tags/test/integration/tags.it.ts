import { describeLive, liveAuth, liveFirst } from '@commercelayer/cli-test-utils'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'

const run = async (args: string[]): Promise<string> => {
  const ctx = await runCommand([...args, ...(await liveAuth())])
  if (ctx.error) throw ctx.error
  return ctx.stdout
}

describeLive('tags', () => {
  let tagId: string | undefined
  before(async () => {
    tagId = await liveFirst('tags')
  })

  it('lists the tags', async () => {
    expect(await run(['tags:list', '-l', '5'])).to.match(/Tag name|No tags found/)
    expect(await run(['tags', '-l', '5'])).to.match(/Tag name|No tags found/)
  })

  it('shows the details of a tag', async function () {
    if (!tagId) this.skip()
    expect(await run(['tags:details', tagId as string])).to.contain(tagId as string)
  })

  it('counts and lists the resources with a tag', async function () {
    if (!tagId) this.skip()
    expect(await run(['tags:count', tagId as string])).to.be.a('string')
    expect(await run(['tags:which', tagId as string, '-t', 'customers', '-l', '5'])).to.be.a('string')
  })
})
