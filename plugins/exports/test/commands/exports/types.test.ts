import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('exports:types', () => {
  it('lists the exportable resource types', async () => {
    const ctx = await runCommand(['exports:types'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('skus')
    expect(ctx.stdout).to.contain('orders')
  })
})
