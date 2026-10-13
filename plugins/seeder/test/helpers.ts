/** Test helpers: the shared ones from @commercelayer/cli-test-utils, plus this plugin's own. */
import { join } from 'node:path'
import { accessToken, list, ORG } from '@commercelayer/cli-test-utils'
import nock from 'nock'

export { api, apiError, list, ORG, resource, single, useMockedApi } from '@commercelayer/cli-test-utils'

export const token = (kind = 'integration') => accessToken({ kind, test: true })
/** Organization and token flags every API command needs */
export const AUTH = ['-o', ORG, '--accessToken', token()]

/** The folder of the local business models */
export const FIXTURES = join(__dirname, 'fixtures', 'model')
/** A local custom business model (the seeder reads models from a URL or a path) */
export const model = (name: string) => ['-u', FIXTURES, '-b', 'custom', '-n', name]
export const MODEL = model('test_model')

/** The default seeder data URL */
export const DATA_URL = 'https://data.commercelayer.app'

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
          price_listCreate: createSchema('price_lists', ['name', 'currency_code', 'reference', 'reference_origin']),
          customer_groupCreate: createSchema('customer_groups', ['name', 'reference', 'reference_origin']),
        },
      },
    })

/**
 * A remote business model importing all the records of its data files. The data files are cached by
 * resource type for the whole test run, so each remote test must use its own
 * resource types.
 */
export const mockRemoteModel = (base: string, path: string, name: string, data: Record<string, object[]>): nock.Scope => {
  const scope = nock(base)
    .get(`${path}/${name}.json`)
    .reply(
      200,
      Object.keys(data).map((resourceType) => ({ resourceType, importAll: true })),
    )
  for (const [type, records] of Object.entries(data)) scope.get(`${path}/data/${type}.json`).reply(200, records)
  return scope
}

/** findByReference(): the lookup by reference of a seeded resource */
export const byReference = (scope: nock.Scope, type: string, reference: string, found?: { id: string }) =>
  scope
    .get(`/api/${type}`)
    .query((q) => q['filter[q][reference_eq]'] === reference)
    .reply(200, list(found ? [{ id: found.id, type, attributes: { reference } }] : []))
