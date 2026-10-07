import { expect, test } from '@oclif/test'

describe('applications', () => {
  test
    .timeout(10000)
    .stdout()
    .command(['noc'])
    .it('runs noc', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
