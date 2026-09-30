import { expect, test } from '@oclif/test'

describe('stripe_gateways:update_webhooks', () => {
  test
    .timeout(62000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
