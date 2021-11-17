import { expect, test } from '@oclif/test'

describe('orders:approve_and_capture', () => {
  test
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
