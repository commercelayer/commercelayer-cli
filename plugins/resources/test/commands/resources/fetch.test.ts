import { expect, test } from '@oclif/test'

describe('resources:fetch', () => {
  test
    .timeout(5000)
    .stdout()
    .command(['resources:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
