import {expect, test} from '@oclif/test'

describe('resources:create', () => {
  test
  .stdout()
  .command(['noc'])
  .it('runs resources:create', ctx => {
    expect(ctx.stdout).to.contain('-= NoC =-')
  })

})
