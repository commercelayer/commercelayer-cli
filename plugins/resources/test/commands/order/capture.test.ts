import {expect, test} from '@oclif/test'

describe('order:capture', () => {
  test
  .stdout()
  .command(['order:capture'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['order:capture', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
