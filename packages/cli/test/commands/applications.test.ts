import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('applications', () => {
  it('runs noc', async function () {
    this.timeout(10000)
    const ctx = await runCommand(['noc'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('-= NoC =-')
  })
})
