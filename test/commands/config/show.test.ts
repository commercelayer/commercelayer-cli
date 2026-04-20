import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('config:show', () => {
  it('runs config:show', async () => {
    const { stdout, stderr } = await runCommand(['config:show'])
    expect(stdout + stderr).to.contain('CLI configuration')
  })
})