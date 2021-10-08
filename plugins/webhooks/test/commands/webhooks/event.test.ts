import {expect, test} from '@oclif/test'

describe('webhooks:event', () => {
  test
  .stdout()
  .command(['webhooks:event'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['webhooks:event', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
