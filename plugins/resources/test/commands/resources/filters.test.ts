import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('resources:filters', () => {
  it('lists the available filter predicates', async () => {
    const ctx = await runCommand(['resources:filters'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('available resource filters')
    expect(ctx.stdout).to.contain('eq')
    expect(ctx.stdout).to.contain('cont')
  })
})
