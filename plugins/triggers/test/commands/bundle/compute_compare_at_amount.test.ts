import { expect, test } from '@oclif/test'

describe('bundles:compute_compare_at_amount', () => {
  test
    .timeout(15000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
