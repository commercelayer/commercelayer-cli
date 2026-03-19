import { expect } from 'chai'
import { runCommand } from '@oclif/test'

describe('cli:update', () => {
  it('runs noc', async () => {
    const { stdout } = await runCommand(['noc'])
    expect(stdout).to.contain('-= NoC =-')
  })
})