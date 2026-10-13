import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, CLIENT_ID, link, resource, single, useMockedApi } from '../../helpers'

describe('links:create', () => {
  useMockedApi()

  const FLAGS = ['-t', 'skus', '-i', 'skuId', '-I', CLIENT_ID, '-S', 'market:id:mkT1', '-e', '2027-09-01']
  const sku = single(resource('skus', 'skuId', { code: 'TSHIRT-M', name: 'T-shirt' }))
  const created = single(link('lnK1'), [resource('skus', 'skuId', { code: 'TSHIRT-M' })])

  it('creates a link for the resource, with a default name and the default link domain', async () => {
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
    const ctx = await runCommand(['links:create', ...AUTH, ...FLAGS])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('https://test-org.c11r.link/lnK1')
    expect(ctx.stdout).to.contain('created new link lnK1 for resource of type skus and id skuId')
  })

  it('uses the name and link domain flags', async () => {
    api()
      .get('/api/skus/skuId')
      .reply(200, sku)
      .post('/api/links', (body) => body.data.attributes.domain === 'links.example.com' && body.data.attributes.name === 'Promo')
      .query(true)
      .reply(201, created)
    const ctx = await runCommand(['links:create', ...AUTH, ...FLAGS, '-n', 'Promo', '-D', 'links.example.com'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('created new link lnK1')
  })

  it('rejects a client_id of the wrong length', async () => {
    api().get('/api/skus/skuId').reply(200, sku)
    const ctx = await runCommand(['links:create', ...AUTH, '-t', 'skus', '-i', 'skuId', '-I', 'too-short', '-S', 'market:id:mkT1', '-e', '2027-09-01'])
    expect(ctx.error?.message).to.match(/Invalid client_id/)
  })

  it('rejects an invalid scope', async () => {
    api().get('/api/skus/skuId').reply(200, sku)
    const ctx = await runCommand(['links:create', ...AUTH, '-t', 'skus', '-i', 'skuId', '-I', CLIENT_ID, '-S', 'country:IT', '-e', '2027-09-01'])
    expect(ctx.error?.message).to.match(/Invalid scope prefix: country/)
  })

  it('rejects an invalid expiration date', async () => {
    api().get('/api/skus/skuId').reply(200, sku)
    const ctx = await runCommand(['links:create', ...AUTH, '-t', 'skus', '-i', 'skuId', '-I', CLIENT_ID, '-S', 'market:id:mkT1', '-e', '"next week"'])
    expect(ctx.error?.message).to.match(/Invalid date: next week/)
  })

  it('rejects a resource that does not exist', async () => {
    api().get('/api/skus/nope').reply(404, { errors: [{ title: 'Record not found', detail: 'not found', code: 'RECORD_NOT_FOUND', status: '404' }] })
    const ctx = await runCommand(['links:create', ...AUTH, '-t', 'skus', '-i', 'nope', '-I', CLIENT_ID, '-S', 'market:id:mkT1', '-e', '2027-09-01'])
    expect(ctx.error?.message).to.match(/Non existent or not accessible sku with id nope/)
  })
})
