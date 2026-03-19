import { expect } from 'chai'
import { runHook } from '@oclif/test'

describe('hooks', () => {
  it('prerun:application', async () => {
    const { stdout } = await runHook('prerun', { id: 'noc' })
    expect(stdout).to.be.itself
  })
})