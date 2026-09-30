import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('links:resources', () => {
  it('lists the linkable resource types', async () => {
    const ctx = await runCommand(['links:resources'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Supported linkable resources')
    expect(ctx.stdout).to.contain('skus')
  })
})
