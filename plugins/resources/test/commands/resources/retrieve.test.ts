import { expect, test } from '@oclif/test'

describe('resources:retrieve', () => {
  test
    .stdout()
    .command(['resources:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })

})
