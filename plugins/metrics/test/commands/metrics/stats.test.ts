
import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('metrics:stats', () => {
  it('runs NoC', async () => {
    const { stdout } = await runCommand<{ name: string }>(['metrics:noc'])
    expect(stdout).to.contain('-= NoC =-')
  })
})
