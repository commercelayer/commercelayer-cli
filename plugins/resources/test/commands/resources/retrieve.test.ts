import {expect, test} from '@oclif/test'

describe('resources:retrieve', () => {
  test
  .stdout()
  .command(['noc'])
  .it('runs resources:retrieve', ctx => {
    expect(ctx.stdout).to.contain('-= NoC =-')
  })

})
