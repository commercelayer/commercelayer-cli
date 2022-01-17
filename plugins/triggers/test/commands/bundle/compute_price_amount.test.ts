import { expect, test } from '@oclif/test'

describe('bundles:compute_price_amount', () => {
  test
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
