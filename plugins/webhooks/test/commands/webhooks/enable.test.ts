import { expect, test } from '@oclif/test'
import { AUTH, api, single, useMockedApi, webhook } from '../../helpers'

describe('webhooks:enable', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .get('/api/webhooks/wHk1')
        .reply(200, single(webhook('wHk1', { disabled_at: '2026-03-01T10:00:00.000Z' })))
        .patch('/api/webhooks/wHk1', (body) => body.data.attributes._enable === true)
        .reply(200, single(webhook('wHk1')))
    })
    .stdout()
    .command(['webhooks:enable', 'wHk1', ...AUTH])
    .it('enables the webhook', (ctx) => {
      expect(ctx.stdout).to.contain('enabled webhook with id wHk1')
    })
})
