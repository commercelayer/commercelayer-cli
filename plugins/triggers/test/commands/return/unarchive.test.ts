import { expect, test } from '@oclif/test'

describe('returns:unarchive', () => {
  test
    .timeout(31000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
