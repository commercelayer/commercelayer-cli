import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { extractResourceTypes } from '@commercelayer/cli-generator'
import { expect } from 'chai'
import clConfig from '../../src/config'

describe('resource types', () => {
  const snapshot = JSON.parse(readFileSync(join(__dirname, '../../gen/resource-types.json'), 'utf8')).data

  it('come from the OpenAPI schema snapshot', () => {
    expect(clConfig.imports.types).to.deep.equal(snapshot.imports)
    expect(clConfig.exports.types).to.deep.equal(snapshot.exports)
    expect(clConfig.cleanups.types).to.deep.equal(snapshot.cleanups)
    expect(clConfig.tags.taggable_resources).to.deep.equal(snapshot.tags)
    expect(clConfig.links.linkable_resources).to.deep.equal(snapshot.links)
  })

  it('include coupon cleanups', () => {
    expect(clConfig.cleanups.types).to.include('coupons')
  })

  it('are extracted from the resource_type enums, tags and link items of the schema', () => {
    const resource = (type: string, relationships: Record<string, unknown> = {}) => ({
      properties: { data: { properties: { type: { enum: [type] }, relationships: { properties: relationships } } } },
    })
    const create = (resourceTypes: string[]) => ({
      properties: { data: { properties: { attributes: { properties: { resource_type: { enum: resourceTypes } } } } } },
    })
    const openapi = {
      components: {
        schemas: {
          importCreate: create(['skus', 'coupons']),
          exportCreate: create(['orders']),
          cleanupCreate: create(['skus', 'coupons']),
          linkCreate: { properties: { data: { properties: { relationships: { properties: { item: { properties: { data: { properties: { type: { enum: ['skus', 'orders'] } } } } } } } } } } },
          sku: resource('skus', { tags: {} }),
          skuCreate: resource('skus', { tags: {} }),
          promotion: resource('promotions', { tags: {} }),
          market: resource('markets'),
        },
      },
    }
    expect(extractResourceTypes(openapi)).to.deep.equal({
      imports: ['coupons', 'skus'],
      exports: ['orders'],
      cleanups: ['coupons', 'skus'],
      tags: ['promotions', 'skus'],
      links: ['orders', 'skus'],
    })
  })
})
