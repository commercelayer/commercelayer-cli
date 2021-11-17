import { expect, test } from '@oclif/test'

describe('orders:billing_address_clone_id', () => {
  test
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
