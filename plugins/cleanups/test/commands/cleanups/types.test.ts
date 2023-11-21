import { expect, test } from '@oclif/test'

describe('cleanups:types', () => {
  test
    .timeout(15000)
    .stdout()
    .command(['cleanups:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
