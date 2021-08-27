import {expect, test} from '@oclif/test'

describe('webhooks:reset', () => {
  test
  .stdout()
  .command(['webhooks:reset'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['webhooks:reset', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
