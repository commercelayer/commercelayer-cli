import { expect, test } from '@oclif/test'

describe('buy_x_pay_y_promotions:disable', () => {
  test
    .timeout(46000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
