import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('config:show', () => {
  it('runs config:show', async () => {
    const ctx = await runCommand(['config:show'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('currentApplication:')
  })
})
