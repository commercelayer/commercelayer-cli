import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH } from '../../helpers'

describe('resources:last', () => {
  it('rejects an unknown resource', async () => {
    const ctx = await runCommand(['resources:last', 'unicorns', ...AUTH])
    expect(ctx.error?.message).to.match(/Invalid resource unicorns/)
  })
})
