import { expect, test } from '@oclif/test'

describe('links:resources', () => {
  test
    .stdout()
    .command(['links:resources'])
    .it('lists the linkable resource types', (ctx) => {
      expect(ctx.stdout).to.contain('Supported linkable resources')
      expect(ctx.stdout).to.contain('skus')
    })
})
