import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('tags:types', () => {
  it('lists the taggable resource types', async () => {
    const ctx = await runCommand(['tags:types'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Taggable resources')
    expect(ctx.stdout).to.contain('customers')
    expect(ctx.stdout).to.contain('orders')
  })
})
