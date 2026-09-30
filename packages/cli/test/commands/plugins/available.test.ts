import { expect, test } from '@oclif/test'

describe('plugins:available', () => {
  test
    .stdout()
    .command(['noc'])
    .it('runs noc', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })

})
