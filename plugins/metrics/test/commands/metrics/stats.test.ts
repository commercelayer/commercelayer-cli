
import { expect } from 'chai'
import { runCommand } from '@oclif/test'

describe('metrics:stats', () => {
  it('runs NoC', async () => {
    const { stdout } = await runCommand<{ name: string }>(['metrics:noc'])
    expect(stdout).to.contain('-= NoC =-')
  })
})
