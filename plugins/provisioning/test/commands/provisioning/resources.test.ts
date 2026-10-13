import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('provisioning:resources', () => {
  it('lists the available resources', async () => {
    const ctx = await runCommand(['provisioning:resources'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('roles')
    expect(ctx.stdout).to.contain('memberships')
  })
})
