import {expect, test} from '@oclif/test'

describe('applications:current', () => {
  test
  .stdout()
  .command(['applications:current'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['applications:current', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
