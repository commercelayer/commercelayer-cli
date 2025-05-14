import { expect, test } from '@oclif/test'

describe('metrics:breakdown', () => {
  test
    .stdout()
    .command(['metrics:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })

})
