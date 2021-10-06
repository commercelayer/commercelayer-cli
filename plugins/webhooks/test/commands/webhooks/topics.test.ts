import {expect, test} from '@oclif/test'

describe('webhooks:topics', () => {
  test
  .stdout()
  .command(['webhooks:topics'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['webhooks:topics', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
