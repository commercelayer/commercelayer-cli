import { expect, test } from '@oclif/test'

describe('stripe_gateways:disable', () => {
  test
    .timeout(61000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
