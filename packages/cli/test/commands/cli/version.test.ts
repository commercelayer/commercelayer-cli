import { expect, test } from '@oclif/test'

describe('cli:version', () => {
  test
    .stdout()
    .command(['noc'])
    .it('runs noc', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })

})
