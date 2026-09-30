import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('cleanups:types', () => {
  it('lists the supported cleanup types', async () => {
    const ctx = await runCommand(['cleanups:types'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Supported cleanup types')
    expect(ctx.stdout).to.contain('skus')
  })
})
