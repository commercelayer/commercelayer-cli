import { expect, test } from '@oclif/test'

describe('stock_line_items:decrement_stock', () => {
  test
    .timeout(41000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
