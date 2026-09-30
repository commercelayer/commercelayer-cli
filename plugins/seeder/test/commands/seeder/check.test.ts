import { join } from 'node:path'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import nock from 'nock'
import { DATA_URL, MODEL, mockOpenApiSchema, mockRemoteModel, model, useMockedApi } from '../../helpers'

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

  it('checks the relationships with -r', async () => {
    mockOpenApiSchema()
    const ctx = await runCommand(['seeder:check', ...MODEL, '-r'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('SUCCESS')
  })

  it('reports a related resource created after the resource with -r', async () => {
    mockOpenApiSchema()
    const ctx = await runCommand(['seeder:check', ...model('wrong_order_model'), '-r'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout + ctx.stderr).to.contain('Resource shipping_categories.SC1 must be created before resource skus.SKU1')
    expect(ctx.stdout).to.contain('Data check completed with errors')
  })

  it('does not check the relationships without -r', async () => {
    mockOpenApiSchema()
    const ctx = await runCommand(['seeder:check', ...model('wrong_order_model')])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('SUCCESS')
  })

  it('reports a related resource missing from the data files with -r', async () => {
    mockOpenApiSchema()
    const ctx = await runCommand(['seeder:check', ...model('orphan_model'), '-r'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout + ctx.stderr).to.contain('Resource of type shipping_categories and reference SC_GHOST not found')
    expect(ctx.stdout).to.contain('Data check completed with errors')
  })

  it('reports a reference key missing from the data file', async () => {
    mockOpenApiSchema()
    const ctx = await runCommand(['seeder:check', ...model('missing_key_model')])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout + ctx.stderr).to.contain('Resource not found in skus file: SKU_NOPE')
    expect(ctx.stdout).to.contain('Data check completed with errors')
  })

  it('reports an invalid resource type', async () => {
    mockOpenApiSchema()
    const ctx = await runCommand(['seeder:check', ...model('invalid_type_model')])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout + ctx.stderr).to.contain('Invalid resource type: spaceships')
    expect(ctx.stdout).to.contain('Data check completed with errors')
  })

  it('rejects a model item without resource type', async () => {
    mockOpenApiSchema()
    const ctx = await runCommand(['seeder:check', ...model('no_type_model')])
    expect(ctx.error?.message).to.match(/Missing field resourceType in business model item 1/)
  })

  it('rejects reference keys that are not an array', async () => {
    mockOpenApiSchema()
    const ctx = await runCommand(['seeder:check', ...model('no_keys_model')])
    expect(ctx.error?.message).to.match(/Field referenceKeys in item 1 must be an array/)
  })

  it('reports a model that does not exist', async () => {
    mockOpenApiSchema()
    const ctx = await runCommand(['seeder:check', ...model('ghost_model')])
    expect(ctx.error?.message).to.match(/Unable to read data file ghost_model.json from path/)
  })

  it('reports an OpenAPI schema that cannot be read', async () => {
    nock(DATA_URL).get('/schemas/openapi.json').reply(500, 'Internal Server Error')
    const ctx = await runCommand(['seeder:check', ...MODEL])
    expect(ctx.error?.message).to.match(/Error reading OpenAPI schema/)
  })

  it('reads the default business model from the seeder data URL', async () => {
    mockOpenApiSchema()
    mockRemoteModel(DATA_URL, '/seeder', 'single_sku', { price_lists: [{ reference: 'PL1', name: 'Europe', currency_code: 'EUR' }] })
    const ctx = await runCommand(['seeder:check'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('SUCCESS')
    expect(nock.pendingMocks()).to.deep.equal([])
  })

  it('accepts a model name only for the custom business model', async () => {
    const ctx = await runCommand(['seeder:check', '-b', 'multi_market', '-n', 'test_model'])
    expect(ctx.error?.message).to.match(/Model name can be specified only using the custom business model/)
  })

  it('rejects an unknown business model', async () => {
    const ctx = await runCommand(['seeder:check', '-b', 'marketplace'])
    expect(ctx.error?.message).to.match(/Expected --businessModel=marketplace to be one of: single_sku, multi_market, custom/)
  })
})
