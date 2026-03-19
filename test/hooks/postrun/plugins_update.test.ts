import { expect } from 'chai'
import { runHook } from '@oclif/test'

describe('hooks', () => {
  it('postrun:plugins_update', async () => {
    const { stdout } = await runHook('postrun', { id: 'noc' })
    expect(stdout).to.be.itself
  })
})