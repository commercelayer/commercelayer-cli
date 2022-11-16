import { expect, test } from '@oclif/test'

describe('imports:list', () => {
  test
    .timeout(5000)
    .stdout()
    .command(['imports:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })

})
