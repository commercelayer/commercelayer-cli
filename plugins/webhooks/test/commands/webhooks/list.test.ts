import { expect, test } from '@oclif/test'

describe('webhooks:list', () => {
  test
    .timeout(5000)
    .stdout()
    .command(['webhooks:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })

})
