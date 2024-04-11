import { expect, test } from '@oclif/test'

describe('gift_cards:balance_change_cents', () => {
  test
    .timeout(35000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
