import { join } from 'node:path'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { MODEL, mockOpenApiSchema, useMockedApi } from '../../helpers'

describe('seeder:check', () => {
  useMockedApi()

  it('checks the model data against the API schema', async function () {
    this.timeout(20000)
    await mockOpenApiSchema()
    const ctx = await runCommand(['seeder:check', ...MODEL])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('SUCCESS')
    expect(ctx.stdout).to.contain('Data check completed')
  })

  it('reports fields unknown to the API schema', async function () {
    this.timeout(20000)
    await mockOpenApiSchema()
    const ctx = await runCommand(['seeder:check', '-u', join(__dirname, '..', '..', 'fixtures', 'model'), '-b', 'custom', '-n', 'broken_model'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout + ctx.stderr).to.contain('Data check completed with errors')
  })
})
