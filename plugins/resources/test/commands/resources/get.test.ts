import {expect, test} from '@oclif/test'

describe('resources:get', () => {
  test
  .stdout()
  .command(['noc'])
  .it('runs resources:get', ctx => {
    expect(ctx.stdout).to.contain('-= NoC =-')
  })

})
