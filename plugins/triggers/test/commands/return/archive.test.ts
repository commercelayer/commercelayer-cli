import { expect, test } from '@oclif/test'

describe('returns:archive', () => {

  test.timeout(3000)

  test
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
