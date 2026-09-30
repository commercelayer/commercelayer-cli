import { expect, test } from '@oclif/test'

describe('resources:schema', () => {
  test
    .stdout()
    .command(['resources:schema'])
    .it('prints the schema version of the SDK', (ctx) => {
      expect(ctx.stdout).to.match(/Current schema version: \d+\.\d+\.\d+/)
    })
})
