import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import nock from 'nock'
import { AUTH, api, apiError, byReference, DATA_URL, MODEL, mockRemoteModel, model, ORG, useMockedApi } from '../../helpers'

describe('seeder:clean', () => {
  useMockedApi()

  it('deletes the resources of the model found by reference', async function () {
    this.timeout(20000)
    const scope = api()
    // The model is cleaned in reverse order: SKUs first
    byReference(scope, 'skus', 'SKU1', { id: 'sKu1' }).delete('/api/skus/sKu1').reply(204)
    byReference(scope, 'shipping_categories', 'SC1', { id: 'sCt1' }).delete('/api/shipping_categories/sCt1').reply(204)
    const ctx = await runCommand(['seeder:clean', ...AUTH, ...MODEL])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('SUCCESS')
    expect(nock.pendingMocks()).to.deep.equal([])
  })

  it('skips the resources that do not exist', async function () {
    this.timeout(20000)
    const scope = api()
    byReference(scope, 'skus', 'SKU1')
    byReference(scope, 'shipping_categories', 'SC1')
    const ctx = await runCommand(['seeder:clean', ...AUTH, ...MODEL])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('SUCCESS')
    expect(nock.pendingMocks()).to.deep.equal([])
  })

  it('stops at a resource that cannot be deleted', async function () {
    this.timeout(20000)
    // The shipping categories are not processed after the SKU fails
    byReference(api(), 'skus', 'SKU1', { id: 'sKu1' })
      .delete('/api/skus/sKu1')
      .reply(422, apiError(422, 'Cannot delete', 'sku - is referenced by other resources'))
    const ctx = await runCommand(['seeder:clean', ...AUTH, ...MODEL])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Data cleaning not completed')
    expect(nock.pendingMocks()).to.deep.equal([])
  })

  it('stops at an invalid resource type', async () => {
    const ctx = await runCommand(['seeder:clean', ...AUTH, ...model('invalid_type_model')])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout + ctx.stderr).to.contain('Invalid resource type: spaceships')
    expect(ctx.stdout).to.contain('Data cleaning not completed')
  })

  it('prints the debug information', async function () {
    this.timeout(20000)
    const scope = api()
    byReference(scope, 'skus', 'SKU1')
    byReference(scope, 'shipping_categories', 'SC1')
    const ctx = await runCommand(['seeder:clean', ...AUTH, ...MODEL, '--debug'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Execution environment: test')
    // Deletions are never cacheable
    expect(ctx.stdout).to.contain('Estimated total number of requests: 0 (cacheable) / 2 (uncacheable)')
    expect(ctx.stdout).to.contain('SUCCESS')
  })

  it('cleans a business model from the seeder data URL', async function () {
    this.timeout(20000)
    mockRemoteModel(DATA_URL, '/seeder', 'multi_market', { markets: [{ reference: 'MKT1', name: 'Europe' }] })
    byReference(api(), 'markets', 'MKT1', { id: 'mKt1' }).delete('/api/markets/mKt1').reply(204)
    const ctx = await runCommand(['seeder:clean', ...AUTH, '-b', 'multi_market'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain(`Cleaning data for organization ${ORG} using business model multi_market`)
    expect(ctx.stdout).to.contain('SUCCESS')
    expect(nock.pendingMocks()).to.deep.equal([])
  })

  it('reports a model that does not exist', async () => {
    const ctx = await runCommand(['seeder:clean', ...AUTH, ...model('ghost_model')])
    expect(ctx.error?.message).to.match(/Unable to read data file ghost_model.json from path/)
  })

  it('accepts a model name only for the custom business model', async () => {
    const ctx = await runCommand(['seeder:clean', ...AUTH, '-b', 'single_sku', '-n', 'test_model'])
    expect(ctx.error?.message).to.match(/Model name can be specified only using the custom business model/)
  })

  it('requires an access token', async () => {
    const ctx = await runCommand(['seeder:clean', '-o', ORG, ...MODEL])
    expect(ctx.error?.message).to.match(/Missing required flag accessToken/)
  })
})
