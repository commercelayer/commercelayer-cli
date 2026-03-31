import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('config:get', () => {
  it('runs config:get', async () => {
    const { stdout } = await runCommand(['config:get', 'currentApplication'])
    expect(stdout).to.contain('currentApplication =')
  })
})