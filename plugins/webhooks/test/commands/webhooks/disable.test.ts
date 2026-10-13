import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, single, useMockedApi, webhook } from '../../helpers'

describe('webhooks:disable', () => {
  useMockedApi()

  it('disables the webhook', async () => {
    api()
      .get('/api/webhooks/wHk1')
      .reply(200, single(webhook('wHk1')))
      .patch('/api/webhooks/wHk1', (body) => body.data.attributes._disable === true)
      .reply(200, single(webhook('wHk1', { disabled_at: '2026-03-01T10:00:00.000Z' })))
    const ctx = await runCommand(['webhooks:disable', 'wHk1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('disabled webhook with id wHk1')
  })
})
