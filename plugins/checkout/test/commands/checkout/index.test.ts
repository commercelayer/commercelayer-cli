import { expect, test } from '@oclif/test'

describe('checkout:index', () => {
  test
    .timeout(5000)
    .stdout()
    .command(['checkout:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })

})
