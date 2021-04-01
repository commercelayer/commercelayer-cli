import {expect, test} from '@oclif/test'

describe('applications:login', () => {
  test
  .stdout()
  .command(['applications:login'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.be.itself
  })

})
