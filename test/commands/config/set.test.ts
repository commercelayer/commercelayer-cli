import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('config:set', () => {
  it('runs config:set', async () => {
    const { error } = await runCommand(['config:set', 'fake', 'value'])
    expect(error).to.exist
    expect(error?.message).to.match(/Invalid configuration param/)
  })
})