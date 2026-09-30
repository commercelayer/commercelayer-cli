import { expect, test } from '@oclif/test'

describe('cleanups:types', () => {
  test
    .stdout()
    .command(['cleanups:types'])
    .it('lists the supported cleanup types', (ctx) => {
      expect(ctx.stdout).to.contain('Supported cleanup types')
      expect(ctx.stdout).to.contain('skus')
    })
})
