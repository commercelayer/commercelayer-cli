import { expect, test } from '@oclif/test'
import { AUTH, api, CLIENT_ID, link, resource, single, useMockedApi } from '../../helpers'

describe('links:create', () => {
  useMockedApi()

  const FLAGS = ['-t', 'skus', '-i', 'skuId', '-I', CLIENT_ID, '-S', 'market:id:mkT1', '-e', '2027-09-01']
  const sku = single(resource('skus', 'skuId', { code: 'TSHIRT-M', name: 'T-shirt' }))
  const created = single(link('lnK1'), [resource('skus', 'skuId', { code: 'TSHIRT-M' })])

  test
    .do(() => {
      api()
        .get('/api/skus/skuId')
        .reply(200, sku)
        .post('/api/links', (body) => {
          const { attributes, relationships } = body.data
          return (
            attributes.client_id === CLIENT_ID &&
            attributes.scope === 'market:id:mkT1' &&
            attributes.name === 'Link for sku TSHIRT-M' &&
            attributes.expires_at === '2027-09-01T00:00:00.000Z' &&
            attributes.domain === 'c11r.link' &&
            JSON.stringify(Object.keys(relationships.item.data).sort()) === '["id","type"]' &&
            relationships.item.data.type === 'skus' &&
            relationships.item.data.id === 'skuId'
          )
        })
        .query(true)
        .reply(201, created)
    })
    .stdout()
    .command(['links:create', ...AUTH, ...FLAGS])
    .it('creates a link for the resource, with a default name and the default link domain', (ctx) => {
      expect(ctx.stdout).to.contain('https://test-org.c11r.link/lnK1')
      expect(ctx.stdout).to.contain('created new link lnK1 for resource of type skus and id skuId')
    })

  test
    .do(() => {
      api()
        .get('/api/skus/skuId')
        .reply(200, sku)
        .post('/api/links', (body) => body.data.attributes.domain === 'links.example.com' && body.data.attributes.name === 'Promo')
        .query(true)
        .reply(201, created)
    })
    .stdout()
    .command(['links:create', ...AUTH, ...FLAGS, '-n', 'Promo', '-D', 'links.example.com'])
    .it('uses the name and link domain flags', (ctx) => {
      expect(ctx.stdout).to.contain('created new link lnK1')
    })

  test
    .do(() => {
      api().get('/api/skus/skuId').reply(200, sku)
    })
    .command(['links:create', ...AUTH, '-t', 'skus', '-i', 'skuId', '-I', 'too-short', '-S', 'market:id:mkT1', '-e', '2027-09-01'])
    .catch(/Invalid client_id/)
    .it('rejects a client_id of the wrong length')

  test
    .do(() => {
      api().get('/api/skus/skuId').reply(200, sku)
    })
    .command(['links:create', ...AUTH, '-t', 'skus', '-i', 'skuId', '-I', CLIENT_ID, '-S', 'country:IT', '-e', '2027-09-01'])
    .catch(/Invalid scope prefix: country/)
    .it('rejects an invalid scope')

  test
    .do(() => {
      api().get('/api/skus/skuId').reply(200, sku)
    })
    .command(['links:create', ...AUTH, '-t', 'skus', '-i', 'skuId', '-I', CLIENT_ID, '-S', 'market:id:mkT1', '-e', 'next week'])
    .catch(/Invalid date: next week/)
    .it('rejects an invalid expiration date')

  test
    .do(() => {
      api().get('/api/skus/nope').reply(404, { errors: [{ title: 'Record not found', detail: 'not found', code: 'RECORD_NOT_FOUND', status: '404' }] })
    })
    .command(['links:create', ...AUTH, '-t', 'skus', '-i', 'nope', '-I', CLIENT_ID, '-S', 'market:id:mkT1', '-e', '2027-09-01'])
    .catch(/Non existent or not accessible sku with id nope/)
    .it('rejects a resource that does not exist')
})
