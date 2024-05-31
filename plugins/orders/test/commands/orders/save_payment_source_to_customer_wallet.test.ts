import { expect, test } from '@oclif/test'

describe('orders:save_payment_source_to_customer_wallet', () => {
  test
    .timeout(30000)
    .stdout()
    .command(['orders:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
