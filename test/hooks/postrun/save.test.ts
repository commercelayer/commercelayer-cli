import { expect } from 'chai'
import { runHook } from '@oclif/test'

describe('hooks', () => {
  it('postrun:save', async () => {
    const { stdout } = await runHook('postrun', { id: 'noc' })
    expect(stdout).to.be.itself
  })
})