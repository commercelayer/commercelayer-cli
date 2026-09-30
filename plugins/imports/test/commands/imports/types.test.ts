import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('imports:types', () => {
  it('lists the supported import types', async () => {
    const ctx = await runCommand(['imports:types'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Supported import types')
    expect(ctx.stdout).to.contain('skus')
  })
})
