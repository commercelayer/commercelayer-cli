import { expect, test } from '@oclif/test'

describe('##__RESOURCE_TYPE__##:##__ACTION_ID__##', () => {
  test
    .timeout(##__SPEC_TIMEOUT__##)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
