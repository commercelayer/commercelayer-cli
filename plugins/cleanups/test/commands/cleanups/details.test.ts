import { expect, test } from '@oclif/test'

describe('cleanups:details', () => {
  test
    .timeout(15000)
    .stdout()
    .command(['cleanups:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
