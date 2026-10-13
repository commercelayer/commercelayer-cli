import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, eventCallback, list, useMockedApi } from '../../helpers'

describe('webhooks:events', () => {
  useMockedApi()

  it('lists the event callbacks of the webhook', async () => {
    api()
      .get('/api/event_callbacks')
      .query((q) => q['filter[q][webhook_id_eq]'] === 'wHk1' && q.sort === '-created_at')
      .reply(200, list([eventCallback('eVt1'), eventCallback('eVt2', { response_code: '500' })]))
    const ctx = await runCommand(['webhooks:events', 'wHk1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('eVt1')
    expect(ctx.stdout).to.contain('eVt2')
  })

  it('says when there are no events', async () => {
    api().get('/api/event_callbacks').query(true).reply(200, list([]))
    const ctx = await runCommand(['webhooks:events', 'wHk1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('No events found for webhook wHk1')
  })

  it('rejects a non-positive limit', async () => {
    const ctx = await runCommand(['webhooks:events', 'wHk1', ...AUTH, '-l', '0'])
    expect(ctx.error?.message).to.match(/Limit must be a positive integer/)
  })
})
