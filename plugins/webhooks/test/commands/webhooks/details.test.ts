import {expect, test} from '@oclif/test'

describe('webhooks:create', () => {
  test
  .stdout()
  .command(['webhooks:details'])
  .it('runs NoC', ctx => {
    expect(ctx.stdout).to.contain('-= NoC =-')
  })

})
