import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('plugins:available', () => {
  it('runs noc', async () => {
    const ctx = await runCommand(['noc'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('-= NoC =-')
  })

})
