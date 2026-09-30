import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, eventCallback, notFound, single, useMockedApi, webhook } from '../../helpers'

describe('webhooks:details', () => {
  useMockedApi()

  it('shows the webhook attributes', async () => {
    api().get('/api/webhooks/wHk1').reply(200, single(webhook('wHk1')))
    const ctx = await runCommand(['webhooks:details', 'wHk1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('orders.place')
    expect(ctx.stdout).to.contain('customer | line_items')
    expect(ctx.stdout).not.to.contain('LAST EVENT CALLBACKS')
  })

  it('shows the last event callbacks', async () => {
    api()
      .get('/api/webhooks/wHk1')
      .query((q) => q.include === 'last_event_callbacks')
      .reply(
        200,
        single(webhook('wHk1', {}), [eventCallback('eVt1')]),
      )
    const ctx = await runCommand(['webhooks:details', 'wHk1', ...AUTH, '-e'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('LAST EVENT CALLBACKS')
  })

  it('reports a missing webhook', async () => {
    api().get('/api/webhooks/nope').reply(404, notFound())
    const ctx = await runCommand(['webhooks:details', 'nope', ...AUTH])
    expect(ctx.error?.message).to.match(/Unable to find webhook with id nope/)
  })
})
