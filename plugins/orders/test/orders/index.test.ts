import {expect, test} from '@oclif/test'

describe('orders:index', () => {
  test
  .stdout()
  .command(['webhooks:noc'])
  .it('runs NoC', ctx => {
    expect(ctx.stdout).to.contain('-= NoC =-')
  })

})
