import { expect } from 'chai'
import { runHook } from '@oclif/test'

describe('hooks', () => {
  it('shows a message', async () => {
    const { stdout } = await runHook('init', { id: 'noc' })
    expect(stdout).to.be.itself
  })
})