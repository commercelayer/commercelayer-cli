import { expect, test } from '@oclif/test'
import nock from 'nock'
import { AUTH, api, byReference, MODEL, useMockedApi } from '../../helpers'

describe('seeder:clean', () => {
  useMockedApi()

  test
    .timeout(20000)
    .do(() => {
      const scope = api()
      // The model is cleaned in reverse order: SKUs first
      byReference(scope, 'skus', 'SKU1', { id: 'sKu1' }).delete('/api/skus/sKu1').reply(204)
      byReference(scope, 'shipping_categories', 'SC1', { id: 'sCt1' }).delete('/api/shipping_categories/sCt1').reply(204)
    })
    .stdout()
    .stderr()
    .command(['seeder:clean', ...AUTH, ...MODEL])
    .it('deletes the resources of the model found by reference', (ctx) => {
      expect(ctx.stdout).to.contain('SUCCESS')
      expect(nock.pendingMocks()).to.deep.equal([])
    })

  test
    .timeout(20000)
    .do(() => {
      const scope = api()
      byReference(scope, 'skus', 'SKU1')
      byReference(scope, 'shipping_categories', 'SC1')
    })
    .stdout()
    .stderr()
    .command(['seeder:clean', ...AUTH, ...MODEL])
    .it('skips the resources that do not exist', (ctx) => {
      expect(ctx.stdout).to.contain('SUCCESS')
      expect(nock.pendingMocks()).to.deep.equal([])
    })
})
