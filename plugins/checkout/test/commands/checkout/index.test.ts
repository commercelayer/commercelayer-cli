import { expect, test } from '@oclif/test'

describe('checkout:index', () => {
  test
    .stdout()
    .command(['checkout:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })

})
