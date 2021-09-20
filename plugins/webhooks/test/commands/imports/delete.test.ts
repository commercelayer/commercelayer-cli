import {expect, test} from '@oclif/test'

describe('seed', () => {
  test
  .stdout()
  .command(['imports:noc'])
  .it('runs NoC', ctx => {
    expect(ctx.stdout).to.contain('-= NoC =-')
  })

})
