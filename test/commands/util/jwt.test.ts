import {expect, test} from '@oclif/test'

describe('util:jwt', () => {
  test
  .stdout()
  .command(['util:jwt'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['util:jwt', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
