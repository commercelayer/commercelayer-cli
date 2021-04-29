import { expect, test } from '@oclif/test'

describe('applications:current', () => {
  test
    .stdout()
    .command(['noc'])
    .it('runs applications:current', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })

})
