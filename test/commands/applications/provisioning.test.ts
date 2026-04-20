import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('applications:provisioning', () => {
  it('runs noc', async () => {
    const { stdout } = await runCommand(['noc'])
    expect(stdout).to.contain('-= NoC =-')
  })
})