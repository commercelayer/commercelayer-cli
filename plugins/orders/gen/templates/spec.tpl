import { expect, test } from '@oclif/test'

describe('orders:##__ACTION_ID__##', () => {
  test
    .stdout()
    .command(['orders:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })

})
