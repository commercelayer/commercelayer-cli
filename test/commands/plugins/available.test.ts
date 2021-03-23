import {expect, test} from '@oclif/test'

describe('plugins:available', () => {
  test
  .stdout()
  .command(['plugins:available'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['plugins:available', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
