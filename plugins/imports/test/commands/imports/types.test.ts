import { expect, test } from '@oclif/test'

describe('imports:types', () => {
  test
    .stdout()
    .command(['imports:types'])
    .it('lists the supported import types', (ctx) => {
      expect(ctx.stdout).to.contain('Supported import types')
      expect(ctx.stdout).to.contain('skus')
      expect(ctx.stdout).to.contain('price_lists')
      expect(ctx.stdout).to.contain('stock_locations')
    })
})
