import { expect, test } from '@oclif/test'

describe('token:generate', () => {
  test
    .stdout()
    .command(['token:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })

})
