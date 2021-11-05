import { expect, test } from '@oclif/test'

describe('applications:switch', () => {
  test
    .stdout()
    .command(['noc'])
    .it('runs applications:switch', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })

})
