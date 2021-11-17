import { expect, test } from '@oclif/test'

describe('shipments:ready_to_ship', () => {
  test
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
