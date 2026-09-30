import { expect, test } from '@oclif/test'

describe('provisioning:resources', () => {
  test
    .stdout()
    .command(['provisioning:resources'])
    .it('lists the available resources', (ctx) => {
      expect(ctx.stdout).to.contain('roles')
      expect(ctx.stdout).to.contain('memberships')
    })
})
