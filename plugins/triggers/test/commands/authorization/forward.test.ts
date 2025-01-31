import { expect, test } from '@oclif/test'

describe('authorizations:forward', () => {
  test
    .timeout(45000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
