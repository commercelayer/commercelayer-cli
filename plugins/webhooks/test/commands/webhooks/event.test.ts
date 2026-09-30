import { expect, test } from '@oclif/test'

describe('webhooks:event', () => {
  test
    .timeout(5000)
    .stdout()
    .command(['webhooks:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })

})
