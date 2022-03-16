import { expect, test } from '@oclif/test'

describe('orders:save_shipping_address_to_customer_address_book', () => {

  test.timeout(5000)

  test
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
