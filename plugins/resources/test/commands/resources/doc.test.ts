import { expect, test } from '@oclif/test'

describe('resources:doc', () => {
  test
    .timeout(15000)
    .stdout()
    .command(['resources:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
