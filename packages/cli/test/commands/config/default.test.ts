import { expect, test } from '@oclif/test'

describe('config:default', () => {
  test
    .stdout()
    .command(['noc'])
    .it('runs config:default', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
