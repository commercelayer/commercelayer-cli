import { expect, test } from '@oclif/test'

describe('orders:customer_payment_source_id', () => {
  test
    .timeout(30000)
    .stdout()
    .command(['orders:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
