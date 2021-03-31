import {expect, test} from '@oclif/test'

describe('resources:filters', () => {
  test
  .stdout()
  .command(['resources:filters'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['resources:filters', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
