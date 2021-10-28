import { expect, test } from '@oclif/test'

describe('checkout:index', () => {
  test
    .stdout()
    .command(['checlout:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })

})
