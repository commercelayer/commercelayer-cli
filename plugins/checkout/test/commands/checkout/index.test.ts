import { expect, test } from '@oclif/test'
import { AUTH, api, list, ORG, resource, single, useMockedApi } from '../../helpers'

describe('checkout', () => {
  useMockedApi()

  const order = single(resource('orders', 'oRd1', { number: '1234' }))
  const lineItem = (code: string) => single(resource('line_items', `li-${code}`, { item_type: 'skus', sku_code: code }))

  test
    .do(() => {
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
    })
    .stdout()
    .command(['checkout', ...AUTH, '-S', 'TSHIRT', '-S', 'SOCKS:3', '-m', 'mkT1', '-c', 'SUMMER', '-e', 'jane@example.com'])
    .it('creates an order with line items and prints its checkout URL', (ctx) => {
      expect(ctx.stdout).to.contain('Created order oRd1')
      expect(ctx.stdout).to.contain('Created line item li-TSHIRT')
      expect(ctx.stdout).to.contain('Created line item li-SOCKS')
      expect(ctx.stdout).to.contain(`https://${ORG}.commercelayer.app/checkout/oRd1?accessToken=`)
    })

  test
    .do(() => {
      api()
        .get('/api/skus')
        .query(true)
        .reply(200, list([resource('skus', 'sku1', { code: 'TSHIRT' })]))
    })
    .command(['checkout', ...AUTH, '-S', 'TSHIRT,GHOST'])
    .catch(/Inexistent SKU: GHOST/)
    .it('rejects an SKU that does not exist')

  test
    .command(['checkout', ...AUTH, '-S', 'TSHIRT:many'])
    .catch(/Invalid SKU definition: TSHIRT:many/)
    .it('rejects an invalid quantity')

  test
    .command(['checkout', ...AUTH])
    .catch(/One of the options --order \(-O\), --sku \(-S\) or --bundle \(-B\) is required/)
    .it('requires an order, SKUs or bundles')

  test
    .do(() => {
      api().get('/api/orders/oRd1').query(true).reply(200, order)
    })
    .stdout()
    .command(['checkout', ...AUTH, '-O', 'oRd1'])
    .it('delegates an existing order to checkout:order', (ctx) => {
      expect(ctx.stdout).to.contain('Checkout URL for order oRd1')
    })
})
