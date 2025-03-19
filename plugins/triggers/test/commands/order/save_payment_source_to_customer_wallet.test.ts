import { expect, test } from '@oclif/test'

describe('orders:save_payment_source_to_customer_wallet', () => {
  test
    .timeout(52000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
