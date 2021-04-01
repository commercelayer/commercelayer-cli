import {expect, test} from '@oclif/test'

describe('resources:delete', () => {
  test
  .stdout()
  .command(['noc'])
  .it('runs resources:delete', ctx => {
    expect(ctx.stdout).to.contain('-= NoC =-')
  })

})
