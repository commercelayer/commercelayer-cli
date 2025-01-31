import { expect, test } from '@oclif/test'

describe('stock_transfers:on_hold', () => {
  test
    .timeout(45000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
