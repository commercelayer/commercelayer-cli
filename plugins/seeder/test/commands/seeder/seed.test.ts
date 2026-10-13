import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import nock from 'nock'
import { AUTH, api, apiError, byReference, DATA_URL, MODEL, mockOpenApiSchema, mockRemoteModel, model, ORG, single, token, useMockedApi } from '../../helpers'

describe('seeder:seed', () => {
  useMockedApi()

  it('creates the resources of the model, relationships resolved by reference', async function () {
    this.timeout(20000)
    mockOpenApiSchema()
    const scope = api()
    byReference(scope, 'shipping_categories', 'SC1')
      .post('/api/shipping_categories', (body) => body.data.attributes.name === 'Merchandise' && body.data.attributes.reference === 'SC1' && body.data.attributes.reference_origin === 'CLI')
      .reply(201, single({ id: 'sCt1', type: 'shipping_categories', attributes: { reference: 'SC1' } }))
    byReference(scope, 'skus', 'SKU1')
    byReference(scope, 'shipping_categories', 'SC1', { id: 'sCt1' })
      .post('/api/skus', (body) => body.data.attributes.code === 'TSHIRT' && body.data.relationships.shipping_category.data.id === 'sCt1')
      .reply(201, single({ id: 'sKu1', type: 'skus', attributes: { reference: 'SKU1' } }))
    const ctx = await runCommand(['seeder:seed', ...AUTH, ...MODEL])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('SUCCESS')
    expect(nock.pendingMocks()).to.deep.equal([])
  })

  it('keeps the resources that already exist with -k', async function () {
    this.timeout(20000)
    mockOpenApiSchema()
    const scope = api()
    byReference(scope, 'shipping_categories', 'SC1', { id: 'sCt1' })
    byReference(scope, 'skus', 'SKU1', { id: 'sKu1' })
    const ctx = await runCommand(['seeder:seed', ...AUTH, ...MODEL, '-k'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('SUCCESS')
    expect(nock.pendingMocks()).to.deep.equal([])
  })

  it('requires an integration token', async () => {
    const ctx = await runCommand(['seeder:seed', '-o', ORG, '--accessToken', token('sales_channel'), ...MODEL])
    expect(ctx.error?.message).to.match(/Invalid application type: sales_channel/)
  })

  it('accepts a model name only for the custom business model', async () => {
    const ctx = await runCommand(['seeder:seed', ...AUTH, '-u', '/tmp', '-n', 'test_model'])
    expect(ctx.error?.message).to.match(/Model name can be specified only using the custom business model/)
  })

  it('updates the resources that already exist', async () => {
    mockOpenApiSchema()
    const scope = api()
    byReference(scope, 'shipping_categories', 'SC1', { id: 'sCt1' })
      .patch('/api/shipping_categories/sCt1', (body) => body.data.id === 'sCt1' && body.data.attributes.name === 'Merchandise' && body.data.attributes.reference_origin === 'CLI')
      .reply(200, single({ id: 'sCt1', type: 'shipping_categories', attributes: { reference: 'SC1' } }))
    byReference(scope, 'skus', 'SKU1', { id: 'sKu1' })
    byReference(scope, 'shipping_categories', 'SC1', { id: 'sCt1' })
      .patch('/api/skus/sKu1', (body) => body.data.attributes.code === 'TSHIRT' && body.data.relationships.shipping_category.data.id === 'sCt1')
      .reply(200, single({ id: 'sKu1', type: 'skus', attributes: { reference: 'SKU1' } }))
    const ctx = await runCommand(['seeder:seed', ...AUTH, ...MODEL])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('SUCCESS')
    expect(nock.pendingMocks()).to.deep.equal([])
  })

  it('stops at a resource rejected by the API', async () => {
    mockOpenApiSchema()
    // The SKUs are not processed after the shipping category fails
    byReference(api(), 'shipping_categories', 'SC1')
      .post('/api/shipping_categories')
      .reply(422, apiError(422, 'Invalid name', 'name - has already been taken'))
    const ctx = await runCommand(['seeder:seed', ...AUTH, ...MODEL])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Data seeding not completed')
    expect(nock.pendingMocks()).to.deep.equal([])
  })

  it('stops at a relationship that cannot be resolved', async () => {
    mockOpenApiSchema()
    const scope = api()
    byReference(scope, 'shipping_categories', 'SC1', { id: 'sCt1' })
    byReference(scope, 'skus', 'SKU_ORPHAN')
    byReference(scope, 'shipping_categories', 'SC_GHOST')
    const ctx = await runCommand(['seeder:seed', ...AUTH, ...model('orphan_model'), '-k'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout + ctx.stderr).to.contain('Unable to find resource of type shipping_categories with reference SC_GHOST')
    expect(ctx.stdout).to.contain('Data seeding not completed')
    expect(nock.pendingMocks()).to.deep.equal([])
  })

  it('prints the debug information', async () => {
    mockOpenApiSchema()
    byReference(api(), 'shipping_categories', 'SC1', { id: 'sCt1' })
    const ctx = await runCommand(['seeder:seed', ...AUTH, ...model('categories_model'), '-k', '--debug'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Execution environment: test')
    expect(ctx.stdout).to.contain('Estimated total number of requests: 0 (cacheable) / 2 (uncacheable)')
    expect(ctx.stdout).to.contain('Uncacheable resources: shipping_categories')
    expect(ctx.stdout).to.contain('SUCCESS')
  })

  it('waits between resource types with -D', async () => {
    mockOpenApiSchema()
    byReference(api(), 'shipping_categories', 'SC1', { id: 'sCt1' })
    const ctx = await runCommand(['seeder:seed', ...AUTH, ...model('categories_model'), '-k', '-D', '10'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('SUCCESS')
  })

  it('seeds a business model from the seeder data URL through the seed alias', async () => {
    mockOpenApiSchema()
    mockRemoteModel(DATA_URL, '/seeder', 'multi_market', { customer_groups: [{ reference: 'CG1', name: 'VIP' }] })
    byReference(api(), 'customer_groups', 'CG1')
      .post('/api/customer_groups', (body) => body.data.attributes.name === 'VIP' && body.data.attributes.reference === 'CG1')
      .reply(201, single({ id: 'cGr1', type: 'customer_groups', attributes: { reference: 'CG1' } }))
    const ctx = await runCommand(['seed', ...AUTH, '-b', 'multi_market'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain(`Seeding data for organization ${ORG} using business model multi_market`)
    expect(ctx.stdout).to.contain('SUCCESS')
    expect(nock.pendingMocks()).to.deep.equal([])
  })

  it('reports a model that cannot be read from the URL', async () => {
    mockOpenApiSchema()
    nock('https://seeds.example.com').get('/custom/ghost_model.json').reply(404, 'Not Found')
    const ctx = await runCommand(['seeder:seed', ...AUTH, '-u', 'https://seeds.example.com/custom', '-b', 'custom', '-n', 'ghost_model'])
    expect(ctx.error?.message).to.match(/Unable to read data file ghost_model.json from url https:\/\/seeds.example.com\/custom/)
  })

  it('requires an access token', async () => {
    const ctx = await runCommand(['seeder:seed', '-o', ORG, ...MODEL])
    expect(ctx.error?.message).to.match(/Missing required flag accessToken/)
  })
})
