import { expect, test } from '@oclif/test'

describe('braintree_gateways:enable', () => {
  test
    .timeout(61000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
