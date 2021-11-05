import { expect, test } from '@oclif/test'

describe('applications:info', () => {
  test
    .stdout()
    .command(['noc'])
    .it('runs applications:info', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })

})
