import { expect, test } from '@oclif/test'

describe('orders:place', () => {

  test.timeout(5000)

  test
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
