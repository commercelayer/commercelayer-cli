import { join } from 'node:path'
import { expect, test } from '@oclif/test'
import { MODEL, mockOpenApiSchema, useMockedApi } from '../../helpers'

describe('seeder:check', () => {
  useMockedApi()

  test
    .timeout(20000)
    .do(mockOpenApiSchema)
    .stdout()
    .stderr()
    .command(['seeder:check', ...MODEL])
    .it('checks the model data against the API schema', (ctx) => {
      expect(ctx.stdout).to.contain('SUCCESS')
      expect(ctx.stdout).to.contain('Data check completed')
    })

  test
    .timeout(20000)
    .do(mockOpenApiSchema)
    .stdout()
    .stderr()
    .command(['seeder:check', '-u', join(__dirname, '..', '..', 'fixtures', 'model'), '-b', 'custom', '-n', 'broken_model'])
    .it('reports fields unknown to the API schema', (ctx) => {
      expect(ctx.stdout + ctx.stderr).to.contain('Data check completed with errors')
    })
})
