import { runHook } from '@oclif/test'
import { expect } from 'chai'

describe('hooks', () => {
  it('prerun:application', async () => {
    const { stdout } = await runHook('prerun', { id: 'noc' })
    expect(stdout).to.be.itself
  })
})