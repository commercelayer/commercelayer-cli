import { expect, test } from '@oclif/test'
import nock from 'nock'
import { AUTH, api, byReference, MODEL, mockOpenApiSchema, ORG, single, token, useMockedApi } from '../../helpers'

describe('seeder:seed', () => {
  useMockedApi()

  test
    .timeout(20000)
    .do(() => {
      mockOpenApiSchema()
      const scope = api()
      byReference(scope, 'shipping_categories', 'SC1')
        .post('/api/shipping_categories', (body) => body.data.attributes.name === 'Merchandise' && body.data.attributes.reference === 'SC1' && body.data.attributes.reference_origin === 'CLI')
        .reply(201, single({ id: 'sCt1', type: 'shipping_categories', attributes: { reference: 'SC1' } }))
      byReference(scope, 'skus', 'SKU1')
      byReference(scope, 'shipping_categories', 'SC1', { id: 'sCt1' })
        .post('/api/skus', (body) => body.data.attributes.code === 'TSHIRT' && body.data.relationships.shipping_category.data.id === 'sCt1')
        .reply(201, single({ id: 'sKu1', type: 'skus', attributes: { reference: 'SKU1' } }))
    })
    .stdout()
    .stderr()
    .command(['seeder:seed', ...AUTH, ...MODEL])
    .it('creates the resources of the model, relationships resolved by reference', (ctx) => {
      expect(ctx.stdout).to.contain('SUCCESS')
      expect(nock.pendingMocks()).to.deep.equal([])
    })

  test
    .timeout(20000)
    .do(() => {
      mockOpenApiSchema()
      const scope = api()
      byReference(scope, 'shipping_categories', 'SC1', { id: 'sCt1' })
      byReference(scope, 'skus', 'SKU1', { id: 'sKu1' })
    })
    .stdout()
    .stderr()
    .command(['seeder:seed', ...AUTH, ...MODEL, '-k'])
    .it('keeps the resources that already exist with -k', (ctx) => {
      expect(ctx.stdout).to.contain('SUCCESS')
      expect(nock.pendingMocks()).to.deep.equal([])
    })

  test
    .command(['seeder:seed', '-o', ORG, '--accessToken', token('sales_channel'), ...MODEL])
    .catch(/Invalid application type: sales_channel/)
    .it('requires an integration token')

  test
    .command(['seeder:seed', ...AUTH, '-u', '/tmp', '-n', 'test_model'])
    .catch(/Model name can be specified only using the custom business model/)
    .it('accepts a model name only for the custom business model')
})
