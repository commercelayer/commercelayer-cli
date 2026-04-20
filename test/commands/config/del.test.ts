import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('config:del', () => {
  it('runs config:del', async () => {
    const { error } = await runCommand(['config:del', 'fake'])
    expect(error).to.exist
    expect(error?.message).to.match(/Invalid configuration param/)
  })
})