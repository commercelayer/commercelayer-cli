import { expect, test } from '@oclif/test'

describe('fixed_amount_promotions:enable', () => {
  test
    .timeout(62000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
