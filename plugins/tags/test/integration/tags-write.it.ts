import { describeLive, LIVE_RUN, liveAuth, liveCreate, liveDelete, liveFirst, liveName } from '@commercelayer/cli-test-utils'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'

const run = async (args: string[]): Promise<string> => {
  const ctx = await runCommand([...args, ...(await liveAuth())])
  if (ctx.error) throw ctx.error
  return ctx.stdout
}

const tagId = (name: string) => liveFirst('tags', { 'filter[q][name_eq]': name })

// A tag of this run on a customer of this run
describeLive('tags: create, add, remove, update and delete', () => {
  const name = liveName('tag')
  const renamed = liveName('tag2')
  let customer: string | undefined

  before(async () => {
    customer = await liveCreate('customers', { email: `${LIVE_RUN}@example.com` })
  })
  after(async () => {
    await liveDelete('customers', customer)
    for (const n of [name, renamed]) await liveDelete('tags', await tagId(n))
  })

  it('creates a tag', async () => {
    await run(['tags:create', '-n', name])
    expect(await tagId(name)).to.be.a('string')
  })

  it('tags a resource and finds it', async () => {
    expect(await run(['tags:add', '-n', name, '-t', 'customers', '-i', customer as string])).to.contain(customer as string)
    expect(await run(['tags:which', name, '-t', 'customers'])).to.contain(customer as string)
  })

  it('removes the tag from the resource', async () => {
    await run(['tags:remove', '-n', name, '-t', 'customers', '-i', customer as string])
    expect(await run(['tags:which', name, '-t', 'customers'])).not.to.contain(customer as string)
  })

  it('renames the tag', async () => {
    await run(['tags:update', name, '-n', renamed])
    expect(await tagId(renamed)).to.be.a('string')
    expect(await tagId(name)).to.equal(undefined)
  })

  it('deletes the tag', async () => {
    await run(['tags:delete', '-n', renamed])
    expect(await tagId(renamed)).to.equal(undefined)
  })
})
