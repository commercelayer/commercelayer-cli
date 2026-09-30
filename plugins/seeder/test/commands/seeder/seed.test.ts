import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import nock from 'nock'
import { AUTH, api, byReference, MODEL, mockOpenApiSchema, ORG, single, token, useMockedApi } from '../../helpers'

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
})
