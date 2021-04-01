import {expect, test} from '@oclif/test'

describe('plugins:available', () => {
  test
  .stdout()
  .command(['plugins:available'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.be.itself
  })

})
