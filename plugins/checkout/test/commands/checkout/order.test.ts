import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, apiError, ORG, resource, single, TOKEN, token, useMockedApi } from '../../helpers'

describe('checkout:order', () => {
  useMockedApi()

  const URL = `https://${ORG}.commercelayer.app/checkout/oRd1?accessToken=${TOKEN}`

  it('prints the checkout URL of the order', async () => {
    api()
      .get('/api/orders/oRd1')
      .query((q) => q['fields[orders]'] === 'id,number')
      .reply(200, single(resource('orders', 'oRd1', { number: '1234' })))
    const ctx = await runCommand(['checkout:order', 'oRd1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Checkout URL for order oRd1')
    expect(ctx.stdout).to.contain(URL)
  })

  it('reports a missing order', async () => {
    api().get('/api/orders/nope').query(true).reply(404, apiError(404, 'Record not found'))
    const ctx = await runCommand(['checkout:order', 'nope', ...AUTH])
    expect(ctx.error?.message).to.match(/Record not found/)
  })

  it('requires a sales channel token', async () => {
    const ctx = await runCommand(['checkout:order', 'oRd1', '-o', ORG, '-a', token('integration')])
    expect(ctx.error?.message).to.match(/Invalid application kind: integration/)
  })

  it('rejects a token of another organization', async () => {
    const ctx = await runCommand(['checkout:order', 'oRd1', '-o', ORG, '-a', token('sales_channel', 'other-org')])
    expect(ctx.error?.message).to.match(/belongs to a wrong organization: other-org/)
  })
})
