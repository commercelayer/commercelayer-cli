import { expect, test } from '@oclif/test'

describe('applications:current', () => {
  test
    .timeout(5000)
    .stdout()
    .command(['noc'])
    .it('runs noc', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
