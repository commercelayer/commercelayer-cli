import { expect, test } from '@oclif/test'

describe('authorizations:void', () => {
  test
    .timeout(41000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
