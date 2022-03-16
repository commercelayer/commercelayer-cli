import { expect, test } from '@oclif/test'

describe('return_line_items:restock', () => {

  test.timeout(3000)

  test
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
