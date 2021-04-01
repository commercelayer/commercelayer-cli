import {expect, test} from '@oclif/test'

describe('applications:login', () => {
  test
  .stdout()
  .command(['noc'])
  .it('runs applications:login', ctx => {
    expect(ctx.stdout).to.contain('-= NoC =-')
  })

})
