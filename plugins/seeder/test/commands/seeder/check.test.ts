import { expect, test } from '@oclif/test'

describe('seeder:check', () => {
  test
    .timeout(15000)
    .stdout()
    .command(['seeder:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
