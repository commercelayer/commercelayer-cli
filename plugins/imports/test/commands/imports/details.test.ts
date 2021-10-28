import { expect, test } from '@oclif/test'

describe('imports:details', () => {
  test
    .stdout()
    .command(['imports:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })

})
