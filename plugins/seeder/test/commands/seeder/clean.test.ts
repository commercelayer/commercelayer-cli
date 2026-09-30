import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import nock from 'nock'
import { AUTH, api, byReference, MODEL, useMockedApi } from '../../helpers'

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
})
