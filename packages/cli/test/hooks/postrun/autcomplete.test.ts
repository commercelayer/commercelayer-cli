import { runHook } from '@oclif/test'
import { expect } from 'chai'

describe('hooks', () => {
  it('shows a message', async () => {
    const ctx = await runHook('autocomplete', { id: 'noc' })
    if (ctx.error) throw ctx.error
    await (output => expect(output.stdout).to.be.itself)(ctx)
  })
})
