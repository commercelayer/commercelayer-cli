import { expect, test } from '@oclif/test'
import { AUTH, api, apiError, ORG, resource, single, TOKEN, token, useMockedApi } from '../../helpers'

describe('checkout:order', () => {
  useMockedApi()

  const URL = `https://${ORG}.commercelayer.app/checkout/oRd1?accessToken=${TOKEN}`

  test
    .do(() => {
      api()
        .get('/api/orders/oRd1')
        .query((q) => q['fields[orders]'] === 'id,number')
        .reply(200, single(resource('orders', 'oRd1', { number: '1234' })))
    })
    .stdout()
    .command(['checkout:order', 'oRd1', ...AUTH])
    .it('prints the checkout URL of the order', (ctx) => {
      expect(ctx.stdout).to.contain('Checkout URL for order oRd1')
      expect(ctx.stdout).to.contain(URL)
    })

  test
    .do(() => {
      api().get('/api/orders/nope').query(true).reply(404, apiError(404, 'Record not found'))
    })
    .command(['checkout:order', 'nope', ...AUTH])
    .catch(/Record not found/)
    .it('reports a missing order')

  test
    .command(['checkout:order', 'oRd1', '-o', ORG, '-a', token('integration')])
    .catch(/Invalid application kind: integration/)
    .it('requires a sales channel token')

  test
    .command(['checkout:order', 'oRd1', '-o', ORG, '-a', token('sales_channel', 'other-org')])
    .catch(/belongs to a wrong organization: other-org/)
    .it('rejects a token of another organization')
})
