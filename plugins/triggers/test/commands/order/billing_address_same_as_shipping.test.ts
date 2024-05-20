import { expect, test } from '@oclif/test'

describe('orders:billing_address_same_as_shipping', () => {
  test
    .timeout(36000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
