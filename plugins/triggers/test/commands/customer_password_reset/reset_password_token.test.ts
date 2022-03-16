import { expect, test } from '@oclif/test'

describe('customer_password_resets:reset_password_token', () => {

  test.timeout(3000)

  test
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
