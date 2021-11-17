import { expect, test } from '@oclif/test'

describe('checkout_com_payments:authorize', () => {
  test
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
