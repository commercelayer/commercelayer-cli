import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, apiError, list, ORG, resource, single, token, useMockedApi } from '../../helpers'

describe('checkout', () => {
  useMockedApi()

  const order = single(resource('orders', 'oRd1', { number: '1234' }))
  const lineItem = (code: string) => single(resource('line_items', `li-${code}`, { item_type: 'skus', sku_code: code }))

  it('creates an order with line items and prints its checkout URL', async () => {
    api()
      .get('/api/skus')
      .query((q) => q['filter[q][code_matches_any]'] === 'TSHIRT,SOCKS')
      .reply(200, list([resource('skus', 'sku1', { code: 'TSHIRT' }), resource('skus', 'sku2', { code: 'SOCKS' })]))
      .get('/api/bundles')
      .query(true)
      .reply(200, list([]))
      .post('/api/orders', (body) => {
        const { attributes, relationships } = body.data
        return attributes.customer_email === 'jane@example.com' && attributes.coupon_code === 'SUMMER' && relationships.market.data.id === 'mkT1'
      })
      .reply(201, order)
      .post('/api/line_items', (body) => body.data.attributes.sku_code === 'TSHIRT' && body.data.attributes.quantity === 1 && body.data.relationships.order.data.id === 'oRd1')
      .reply(201, lineItem('TSHIRT'))
      .post('/api/line_items', (body) => body.data.attributes.sku_code === 'SOCKS' && body.data.attributes.quantity === 3)
      .reply(201, lineItem('SOCKS'))
    const ctx = await runCommand(['checkout', ...AUTH, '-S', 'TSHIRT', '-S', 'SOCKS:3', '-m', 'mkT1', '-c', 'SUMMER', '-e', 'jane@example.com'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Created order oRd1')
    expect(ctx.stdout).to.contain('Created line item li-TSHIRT')
    expect(ctx.stdout).to.contain('Created line item li-SOCKS')
    expect(ctx.stdout).to.contain(`https://${ORG}.commercelayer.app/checkout/oRd1?accessToken=`)
  })

  it('rejects an SKU that does not exist', async () => {
    api()
      .get('/api/skus')
      .query(true)
      .reply(200, list([resource('skus', 'sku1', { code: 'TSHIRT' })]))
    const ctx = await runCommand(['checkout', ...AUTH, '-S', 'TSHIRT,GHOST'])
    expect(ctx.error?.message).to.match(/Inexistent SKU: GHOST/)
  })

  it('rejects an invalid quantity', async () => {
    const ctx = await runCommand(['checkout', ...AUTH, '-S', 'TSHIRT:many'])
    expect(ctx.error?.message).to.match(/Invalid SKU definition: TSHIRT:many/)
  })

  it('requires an order, SKUs or bundles', async () => {
    const ctx = await runCommand(['checkout', ...AUTH])
    expect(ctx.error?.message).to.match(/One of the options --order \(-O\), --sku \(-S\) or --bundle \(-B\) is required/)
  })

  it('delegates an existing order to checkout:order', async () => {
    api().get('/api/orders/oRd1').query(true).reply(200, order)
    const ctx = await runCommand(['checkout', ...AUTH, '-O', 'oRd1'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Checkout URL for order oRd1')
  })

  it('creates line items for bundles', async () => {
    api()
      .get('/api/skus')
      .query(true)
      .reply(200, list([]))
      .get('/api/bundles')
      .query((q) => q['filter[q][code_matches_any]'] === 'BOX1,BOX2')
      .reply(200, list([resource('bundles', 'bnd1', { code: 'BOX1' }), resource('bundles', 'bnd2', { code: 'BOX2' })]))
      .post('/api/orders', (body) => !body.data.relationships?.market && !body.data.attributes.customer_email)
      .reply(201, order)
      .post('/api/line_items', (body) => body.data.attributes.item_type === 'bundles' && body.data.attributes.bundle_code === 'BOX1' && body.data.attributes.quantity === 2)
      .reply(201, single(resource('line_items', 'li-BOX1', { item_type: 'bundles', bundle_code: 'BOX1' })))
      .post('/api/line_items', (body) => body.data.attributes.bundle_code === 'BOX2' && body.data.attributes.quantity === 1)
      .reply(201, single(resource('line_items', 'li-BOX2', { item_type: 'bundles', bundle_code: 'BOX2' })))
    const ctx = await runCommand(['checkout', ...AUTH, '-B', 'BOX1:2,BOX2'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Created line item li-BOX1 for bundle BOX1 and associated to order oRd1')
    expect(ctx.stdout).to.contain('Created line item li-BOX2 for bundle BOX2')
    expect(ctx.stdout).to.contain(`https://${ORG}.commercelayer.app/checkout/oRd1?accessToken=`)
  })

  it('rejects a bundle that does not exist', async () => {
    api().get('/api/skus').query(true).reply(200, list([])).get('/api/bundles').query(true).reply(200, list([]))
    const ctx = await runCommand(['checkout', ...AUTH, '-B', 'GHOST'])
    expect(ctx.error?.message).to.match(/Inexistent bundle: GHOST/)
  })

  it('rejects a malformed item option', async () => {
    const ctx = await runCommand(['checkout', ...AUTH, '-S', 'TSHIRT:1:2'])
    expect(ctx.error?.message).to.match(/Invalid SKU option: TSHIRT:1:2/)
  })

  it('rejects a negative quantity', async () => {
    const ctx = await runCommand(['checkout', ...AUTH, '-B', 'BOX1:-1'])
    expect(ctx.error?.message).to.match(/Invalid bundle definition: BOX1:-1/)
  })

  it('does not accept SKUs and bundles together', async () => {
    const ctx = await runCommand(['checkout', ...AUTH, '-S', 'TSHIRT', '-B', 'BOX1'])
    expect(ctx.error?.message).to.match(/--bundle=BOX1 cannot also be provided when using --sku/)
  })

  it('does not accept order options with an existing order', async () => {
    const ctx = await runCommand(['checkout', ...AUTH, '-O', 'oRd1', '-m', 'mkT1'])
    expect(ctx.error?.message).to.match(/--order=oRd1 cannot also be provided when using --market/)
  })

  it('requires a sales channel token', async () => {
    const ctx = await runCommand(['checkout', '-o', ORG, '-a', token('integration'), '-S', 'TSHIRT'])
    expect(ctx.error?.message).to.match(/Invalid application kind: integration/)
  })

  it('rejects a token of another organization', async () => {
    const ctx = await runCommand(['checkout', '-o', ORG, '-a', token('sales_channel', 'other-org'), '-S', 'TSHIRT'])
    expect(ctx.error?.message).to.match(/belongs to a wrong organization: other-org/)
  })

  it('reports an order rejected by the API', async () => {
    api()
      .get('/api/skus')
      .query(true)
      .reply(200, list([resource('skus', 'sku1', { code: 'TSHIRT' })]))
      .get('/api/bundles')
      .query(true)
      .reply(200, list([]))
      .post('/api/orders')
      .reply(422, apiError(422, 'Invalid coupon', 'coupon_code - is invalid'))
    const ctx = await runCommand(['checkout', ...AUTH, '-S', 'TSHIRT', '-c', 'NOPE'])
    expect(ctx.error?.message).to.match(/coupon_code - is invalid/)
  })

  it('suggests to log in again when the token is rejected', async () => {
    api().get('/api/skus').query(true).reply(401, apiError(401, 'Invalid token', 'The access token you provided is invalid'))
    const ctx = await runCommand(['checkout', ...AUTH, '-S', 'TSHIRT'])
    expect(ctx.error?.message).to.match(/Invalid token: {2}The access token you provided is invalid/)
    expect((ctx.error as { suggestions?: string[] } | undefined)?.suggestions?.join()).to.match(/Execute login/)
  })

  it('passes the domain on to checkout:order', async () => {
    api(`https://${ORG}.commercelayer.co`).get('/api/orders/oRd1').query(true).reply(200, order)
    const ctx = await runCommand(['checkout', ...AUTH, '-d', 'commercelayer.co', '-O', 'oRd1'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain(`https://${ORG}.stg.commercelayer.app/checkout/oRd1?accessToken=`)
  })
})
