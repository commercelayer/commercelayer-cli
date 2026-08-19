import { expect, test } from '@oclif/test'

describe('checkout_com_gateways:update_webhooks', () => {
  test
    .timeout(61000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
