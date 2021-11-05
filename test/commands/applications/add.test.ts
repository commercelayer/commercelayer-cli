import { expect, test } from '@oclif/test'

describe('applications:add', () => {
  test
    .stdout()
    .command(['noc'])
    .it('runs applications:add', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })

})
