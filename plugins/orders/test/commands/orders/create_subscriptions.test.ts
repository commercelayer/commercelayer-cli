import { expect, test } from '@oclif/test'

describe('orders:create_subscriptions', () => {
  test
    .timeout(27000)
    .stdout()
    .command(['orders:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
