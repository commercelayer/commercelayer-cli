import { expect, test } from '@oclif/test'

describe('markets:disable', () => {
  test
    .timeout(62000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
