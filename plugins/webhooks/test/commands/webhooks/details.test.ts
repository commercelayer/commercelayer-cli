import { expect, test } from '@oclif/test'
import { AUTH, api, eventCallback, notFound, single, useMockedApi, webhook } from '../../helpers'

describe('webhooks:details', () => {
  useMockedApi()

  test
    .do(() => {
      api().get('/api/webhooks/wHk1').reply(200, single(webhook('wHk1')))
    })
    .stdout()
    .command(['webhooks:details', 'wHk1', ...AUTH])
    .it('shows the webhook attributes', (ctx) => {
      expect(ctx.stdout).to.contain('orders.place')
      expect(ctx.stdout).to.contain('customer | line_items')
      expect(ctx.stdout).not.to.contain('LAST EVENT CALLBACKS')
    })

  test
    .do(() => {
      api()
        .get('/api/webhooks/wHk1')
        .query((q) => q.include === 'last_event_callbacks')
        .reply(
          200,
          single(webhook('wHk1', {}), [eventCallback('eVt1')]),
        )
    })
    .stdout()
    .command(['webhooks:details', 'wHk1', ...AUTH, '-e'])
    .it('shows the last event callbacks', (ctx) => {
      expect(ctx.stdout).to.contain('LAST EVENT CALLBACKS')
    })

  test
    .do(() => {
      api().get('/api/webhooks/nope').reply(404, notFound())
    })
    .command(['webhooks:details', 'nope', ...AUTH])
    .catch(/Unable to find webhook with id nope/)
    .it('reports a missing webhook')
})
