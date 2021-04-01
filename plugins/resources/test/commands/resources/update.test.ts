import {expect, test} from '@oclif/test'

describe('resources:update', () => {
  test
  .stdout()
  .command(['noc'])
  .it('runs resources:update', ctx => {
    expect(ctx.stdout).to.contain('-= NoC =-')
  })

})
