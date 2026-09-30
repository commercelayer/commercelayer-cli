/** Test helpers: the shared ones from @commercelayer/cli-test-utils, plus this plugin's own. */
import { join } from 'node:path'
import { accessToken, list, ORG } from '@commercelayer/cli-test-utils'
import nock from 'nock'

export { api, apiError, list, ORG, resource, single, useMockedApi } from '@commercelayer/cli-test-utils'

export const token = (kind = 'integration') => accessToken({ kind, test: true })
/** Organization and token flags every API command needs */
export const AUTH = ['-o', ORG, '--accessToken', token()]

/** A local business model (the seeder reads models from a URL or a path) */
export const MODEL = ['-u', join(__dirname, 'fixtures', 'model'), '-b', 'custom', '-n', 'test_model']

const createSchema = (type: string, attributes: string[], relationships: Record<string, string> = {}) => ({
  properties: {
    data: {
      properties: {
        type: { enum: [type] },
        attributes: { properties: Object.fromEntries(attributes.map((a) => [a, { type: 'string' }])) },
        relationships: {
          properties: Object.fromEntries(Object.entries(relationships).map(([k, t]) => [k, { properties: { data: { properties: { type: { enum: [t] } } } } }])),
        },
      },
    },
  },
})

/** The OpenAPI schema, reduced to what the seeder reads: the *Create schemas */
export const mockOpenApiSchema = (): nock.Scope =>
  nock('https://data.commercelayer.app')
    .get('/schemas/openapi.json')
    .reply(200, {
      info: { version: '7.11.6' },
      components: {
        schemas: {
          shipping_categoryCreate: createSchema('shipping_categories', ['name', 'reference', 'reference_origin']),
          skuCreate: createSchema('skus', ['code', 'name', 'reference', 'reference_origin'], { shipping_category: 'shipping_categories' }),
        },
      },
    })

/** findByReference(): the lookup by reference of a seeded resource */
export const byReference = (scope: nock.Scope, type: string, reference: string, found?: { id: string }) =>
  scope
    .get(`/api/${type}`)
    .query((q) => q['filter[q][reference_eq]'] === reference)
    .reply(200, list(found ? [{ id: found.id, type, attributes: { reference } }] : []))
