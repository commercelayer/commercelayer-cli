import { expect, test } from '@oclif/test'

describe('resources:filters', () => {
  test
    .stdout()
    .command(['resources:filters'])
    .it('lists the available filter predicates', (ctx) => {
      expect(ctx.stdout).to.contain('available resource filters')
      expect(ctx.stdout).to.contain('eq')
      expect(ctx.stdout).to.contain('cont')
    })
})
