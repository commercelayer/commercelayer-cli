import { expect, test } from '@oclif/test'

describe('stripe_gateways:refresh_webhook_secrets', () => {
  test
    .timeout(62000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
