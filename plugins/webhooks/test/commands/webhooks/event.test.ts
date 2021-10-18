import {expect, test} from '@oclif/test'

describe('webhooks:create', () => {
  test
  .stdout()
  .command(['webhooks:event'])
  .it('runs NoC', ctx => {
    expect(ctx.stdout).to.contain('-= NoC =-')
  })

})
