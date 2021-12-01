import {expect, test} from '@oclif/test'

describe('seeder:clean', () => {
  test
  .stdout()
  .command(['seeder:noc'])
  .it('runs seed', ctx => {
    expect(ctx.stdout).to.contain('-= NoC =-')
  })

})
