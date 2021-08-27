import {expect, test} from '@oclif/test'

describe('webhooks:details', () => {
  test
  .stdout()
  .command(['webhooks:details'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['webhooks:details', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
