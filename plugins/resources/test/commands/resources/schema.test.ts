import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('resources:schema', () => {
  it('prints the schema version of the SDK', async () => {
    const ctx = await runCommand(['resources:schema'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.match(/Current schema version: (\d+\.\d+\.\d+|\d{4}-\d{2})/)
  })
})
