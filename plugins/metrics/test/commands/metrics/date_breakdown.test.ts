
import { expect } from 'chai'
import { runCommand } from '@oclif/test'

describe('metrics:date_breakdown', () => {
  it('runs NoC', async () => {
    const { stdout } = await runCommand<{ name: string }>(['metrics:noc'])
    expect(stdout).to.contain('-= NoC =-')
  })
})
