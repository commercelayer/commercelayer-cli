import { expect, test } from '@oclif/test'

describe('exports:types', () => {
  test
    .stdout()
    .command(['exports:types'])
    .it('lists the exportable resource types', (ctx) => {
      expect(ctx.stdout).to.contain('skus')
      expect(ctx.stdout).to.contain('orders')
    })
})
