import {expect, test} from '@oclif/test'

describe('resources:available', () => {
  test
  .stdout()
  .command(['noc'])
  .it('runs resources:available', ctx => {
    expect(ctx.stdout).to.contain('-= NoC =-')
  })

})
