import { expect, test } from '@oclif/test'

describe('orders:##__ACTION_ID__##', () => {
  test
    .timeout(##__SPEC_TIMEOUT__##)
    .stdout()
    .command(['orders:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
