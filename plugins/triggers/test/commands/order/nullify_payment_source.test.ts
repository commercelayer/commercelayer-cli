import { expect, test } from '@oclif/test'

describe('orders:nullify_payment_source', () => {
  test
    .timeout(5000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
