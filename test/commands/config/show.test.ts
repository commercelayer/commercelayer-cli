import {expect, test} from '@oclif/test'

describe('config:show', () => {
  test
  .stdout()
  .command(['config:show'])
  .it('runs config:show', ctx => {
    expect(ctx.stdout).to.contain('currentApplication:')
  })
})
