import {expect, test} from '@oclif/test'

describe('resources:filters', () => {
  test
  .stdout()
  .command(['noc'])
  .it('runs resources:filters', ctx => {
    expect(ctx.stdout).to.contain('-= NoC =-')
  })

})
