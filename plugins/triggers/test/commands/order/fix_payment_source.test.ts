import { expect, test } from '@oclif/test'

describe('orders:fix_payment_source', () => {
  test
    .timeout(45000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
