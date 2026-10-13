import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('config:get', () => {
  it('runs config:get', async () => {
    const ctx = await runCommand(['config:get', 'currentApplication'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('currentApplication =')
  })
})
