import {expect, test} from '@oclif/test'

describe('resources:available', () => {
  test
  .stdout()
  .command(['resources:available'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['resources:available', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
