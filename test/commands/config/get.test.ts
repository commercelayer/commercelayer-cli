import { expect } from 'chai'
import { runCommand } from '@oclif/test'

describe('config:get', () => {
  it('runs noc', async () => {
    const { stdout } = await runCommand(['noc'])
    expect(stdout).to.contain('-= NoC =-')
  })
})