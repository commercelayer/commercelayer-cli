import {expect, test} from '@oclif/test'

describe('applications:token', () => {
  test
  .stdout()
  .command(['applications:token'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.be.itself
  })

})
