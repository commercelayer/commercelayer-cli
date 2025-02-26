import { expect, test } from '@oclif/test'

describe('orders:shipping_address_same_as_billing', () => {
  test
    .timeout(46000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
