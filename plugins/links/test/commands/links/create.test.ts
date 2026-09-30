import { expect, test } from '@oclif/test'

describe('links:create', () => {
  test
    .stdout()
    .command(['links:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })

})
