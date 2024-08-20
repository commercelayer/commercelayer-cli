import { expect, test } from '@oclif/test'

describe('orders:start_editing', () => {
  test
    .timeout(38000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
