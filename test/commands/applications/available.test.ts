import {expect, test} from '@oclif/test'

describe('applications:available', () => {
  test
  .stdout()
  .command(['applications:available'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['applications:available', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
