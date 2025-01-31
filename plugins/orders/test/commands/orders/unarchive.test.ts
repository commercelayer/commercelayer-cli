import { expect } from 'chai'
import { runCommand } from '@oclif/test'


describe('orders:unarchive', () => {
  it('runs NoC', async () => {
    const { stdout } = await runCommand<{ name: string }>(['orders:noc'])
    expect(stdout).to.contain('-= NoC =-')
  }).timeout(31000)
})

