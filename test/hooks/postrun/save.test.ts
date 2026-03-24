import { runHook } from '@oclif/test'
import { expect } from 'chai'

describe('hooks', () => {
  it('postrun:save', async () => {
    const { stdout } = await runHook('postrun', { id: 'noc' })
    expect(stdout).to.be.itself
  })
})