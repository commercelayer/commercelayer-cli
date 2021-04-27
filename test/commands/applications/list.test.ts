import {expect, test} from '@oclif/test'

describe('applications:list', () => {
  test
  .stdout()
  .command(['noc'])
  .it('runs applications:list', ctx => {
    expect(ctx.stdout).to.contain('-= NoC =-')
  })

})
