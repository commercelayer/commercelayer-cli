import { expect, test } from '@oclif/test'

describe('paypal_payments:refresh', () => {
  test
    .timeout(62000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
