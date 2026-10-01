import { describeLive, jsonOutput, liveAuth, liveDelete, liveFirst, liveName } from '@commercelayer/cli-test-utils'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'

const json = async (args: string[]): Promise<any> => {
  const ctx = await runCommand([...args, ...(await liveAuth()), '-j'])
  if (ctx.error) throw ctx.error
  return jsonOutput(ctx.stdout)
}

// A customer group: self-contained, no other resource depends on a new one
describeLive('resources: create, update and delete', () => {
  let id: string | undefined
  after(() => liveDelete('customer_groups', id))

  it('creates a resource with attributes and metadata', async () => {
    const group = await json(['resources:create', 'customer_groups', '-a', `name=${liveName('group')}`, '-m', 'origin=cli-it'])
    id = group.id
    expect(group).to.include({ type: 'customer_groups', name: liveName('group') })
    expect(group.metadata).to.deep.equal({ origin: 'cli-it' })
  })

  it('updates the resource', async function () {
    if (!id) this.skip()
    const group = await json(['resources:update', 'customer_groups', id as string, '-a', `name=${liveName('group2')}`, '-m', 'step=updated'])
    expect(group).to.include({ id, name: liveName('group2') })
    expect(group.metadata).to.deep.equal({ origin: 'cli-it', step: 'updated' })
  })

  it('deletes the resource', async function () {
    if (!id) this.skip()
    const ctx = await runCommand(['resources:delete', 'customer_groups', id as string, ...(await liveAuth())])
    if (ctx.error) throw ctx.error
    expect(await liveFirst('customer_groups', { 'filter[q][id_eq]': id as string })).to.equal(undefined)
    id = undefined
  })
})
