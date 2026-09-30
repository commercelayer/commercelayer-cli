import { expect, test } from '@oclif/test'

describe('exports:create', () => {
  test
    .timeout(15000)
    .stdout()
    .command(['exports:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
