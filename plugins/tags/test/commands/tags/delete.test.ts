import { expect, test } from '@oclif/test'

describe('tags:delete', () => {
  test
    .timeout(15000)
    .stdout()
    .command(['tags:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
