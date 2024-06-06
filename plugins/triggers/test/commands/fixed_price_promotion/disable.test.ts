import { expect, test } from '@oclif/test'

describe('fixed_price_promotions:disable', () => {
  test
    .timeout(37000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
