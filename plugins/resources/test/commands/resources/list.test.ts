import {expect, test} from '@oclif/test'

describe('resources:list', () => {
  test
  .stdout()
  .command(['noc'])
  .it('runs resources:list', ctx => {
    expect(ctx.stdout).to.contain('-= NoC =-')
  })

})
