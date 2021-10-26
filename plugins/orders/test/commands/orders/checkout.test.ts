import {expect, test} from '@oclif/test'

describe('orders:checkout', () => {
  test
  .stdout()
  .command(['orders:checkout'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['orders:checkout', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
