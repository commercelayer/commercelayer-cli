import { expect, test } from '@oclif/test'

describe('orders:nullify_payment_source', () => {
  test
    .timeout(30000)
    .stdout()
    .command(['orders:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
