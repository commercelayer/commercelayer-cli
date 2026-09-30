import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('config:default', () => {
  it('runs config:default', async () => {
    const ctx = await runCommand(['noc'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('-= NoC =-')
  })
})
