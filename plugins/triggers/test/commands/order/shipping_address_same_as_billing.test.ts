import { expect, test } from '@oclif/test'

describe('orders:shipping_address_same_as_billing', () => {
  test
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
