import { expect, test } from '@oclif/test'

describe('orders:customer_payment_source_id', () => {
  test
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
