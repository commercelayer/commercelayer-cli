import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('applications:list', () => {
  it('runs noc', async function () {
    this.timeout(5000)
    const ctx = await runCommand(['noc'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('-= NoC =-')
  })
})
