import { runHook } from '@oclif/test'
import { expect } from 'chai'

describe('hooks', () => {
  it('shows a message', async () => {
    const { stdout } = await runHook('init', { id: 'noc' })
    expect(stdout).to.be.itself
  })
})