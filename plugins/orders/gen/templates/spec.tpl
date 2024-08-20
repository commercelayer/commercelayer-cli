import { expect } from 'chai'
import { runCommand } from '@oclif/test'


describe('orders:##__ACTION_ID__##', () => {
  it('runs NoC', async () => {
    const { stdout } = await runCommand<{ name: string }>(['orders:noc'])
    expect(stdout).to.contain('-= NoC =-')
  }).timeout(##__SPEC_TIMEOUT__##)
})

