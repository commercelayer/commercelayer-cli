import { expect, test } from '@oclif/test'

describe('orders:archive', () => {
  test
    .timeout(29000)
    .stdout()
    .command(['orders:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
