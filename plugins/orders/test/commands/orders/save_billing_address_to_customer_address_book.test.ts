import { expect, test } from '@oclif/test'

describe('orders:save_billing_address_to_customer_address_book', () => {
  test
    .timeout(10000)
    .stdout()
    .command(['orders:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
