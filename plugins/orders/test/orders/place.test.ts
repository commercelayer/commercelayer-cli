import {expect, test} from '@oclif/test'

describe('orders:place', () => {
  test
  .stdout()
  .command(['webhooks:noc'])
  .it('runs NoC', ctx => {
    expect(ctx.stdout).to.contain('-= NoC =-')
  })

})
