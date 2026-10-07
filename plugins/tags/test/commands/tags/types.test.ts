import { expect, test } from '@oclif/test'

describe('tags:types', () => {
  test
    .stdout()
    .command(['tags:types'])
    .it('lists the taggable resource types', (ctx) => {
      expect(ctx.stdout).to.contain('Taggable resources')
      expect(ctx.stdout).to.contain('customers')
      expect(ctx.stdout).to.contain('orders')
    })
})
