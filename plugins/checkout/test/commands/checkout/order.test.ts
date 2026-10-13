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

  it('builds a staging URL for the staging domain', async () => {
    api(`https://${ORG}.commercelayer.co`).get('/api/orders/oRd1').query(true).reply(200, single(resource('orders', 'oRd1')))
    const ctx = await runCommand(['checkout:order', 'oRd1', ...AUTH, '-d', 'commercelayer.co'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain(`https://${ORG}.stg.commercelayer.app/checkout/oRd1?accessToken=${TOKEN}`)
  })

  it('builds the URL on a custom domain', async () => {
    api(`https://${ORG}.example.com`).get('/api/orders/oRd1').query(true).reply(200, single(resource('orders', 'oRd1')))
    const ctx = await runCommand(['checkout:order', 'oRd1', ...AUTH, '-d', 'example.com'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain(`https://${ORG}.example.com/checkout/oRd1?accessToken=${TOKEN}`)
  })

  it('suggests to log in again when the token is rejected', async () => {
    api().get('/api/orders/oRd1').query(true).reply(401, apiError(401, 'Invalid token', 'The access token you provided is invalid'))
    const ctx = await runCommand(['checkout:order', 'oRd1', ...AUTH])
    expect(ctx.error?.message).to.match(/Invalid token/)
  })

  it('rejects a malformed access token', async () => {
    const ctx = await runCommand(['checkout:order', 'oRd1', '-o', ORG, '-a', 'not-a-jwt'])
    expect(ctx.error?.message).to.match(/Error decoding access token/)
  })

  it('requires the order id', async () => {
    const ctx = await runCommand(['checkout:order', ...AUTH])
    expect(ctx.error?.message).to.match(/Missing 1 required arg/)
  })

  it('requires an access token', async () => {
    const ctx = await runCommand(['checkout:order', 'oRd1', '-o', ORG])
    expect(ctx.error?.message).to.match(/Missing required flag accessToken/)
  })
})
