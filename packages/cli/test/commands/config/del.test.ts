import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('config:del', () => {
  it('runs config:del', async () => {
    const ctx = await runCommand(['config:del', 'fake'])
    if (ctx.error) expect(ctx.error?.message).to.match(/Invalid configuration param/)
  })
})
