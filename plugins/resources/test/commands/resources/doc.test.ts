import {expect, test} from '@oclif/test'

describe('resources:doc', () => {
  test
  .stdout()
  .command(['resources:doc'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['resources:doc', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
