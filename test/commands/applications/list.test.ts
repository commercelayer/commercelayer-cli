import {expect, test} from '@oclif/test'

describe('applications:list', () => {
  test
  .stdout()
  .command(['applications:list'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.be.itself
  })

})
