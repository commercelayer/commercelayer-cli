import { expect, test } from '@oclif/test'
import { AUTH, api, single, useMockedApi, webhook } from '../../helpers'

describe('webhooks:disable', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .get('/api/webhooks/wHk1')
        .reply(200, single(webhook('wHk1')))
        .patch('/api/webhooks/wHk1', (body) => body.data.attributes._disable === true)
        .reply(200, single(webhook('wHk1', { disabled_at: '2026-03-01T10:00:00.000Z' })))
    })
    .stdout()
    .command(['webhooks:disable', 'wHk1', ...AUTH])
    .it('disables the webhook', (ctx) => {
      expect(ctx.stdout).to.contain('disabled webhook with id wHk1')
    })
})
