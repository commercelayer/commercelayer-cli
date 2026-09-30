import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('config:set', () => {
  it('runs config:set', async () => {
    const ctx = await runCommand(['config:set', 'fake', 'value'])
    if (ctx.error) expect(ctx.error?.message).to.match(/Invalid configuration param/)
  })
})
