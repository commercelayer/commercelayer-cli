import { expect, test } from '@oclif/test'

describe('microstore:index', () => {
  test
    .stdout()
    .command(['microstore:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })

})
